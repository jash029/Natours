/**
 * One-Time Production Migration Script: Legacy String Image URLs to Structured Image Objects
 *
 * Usage:
 *   node src/scripts/migrateTourImages.js
 *   npm run migrate:images
 */

const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from config.env
dotenv.config({ path: path.join(__dirname, "../../config.env") });

const Tour = require("../models/tourModel");
const {
  logBanner,
  logInfo,
  logSuccess,
  logWarn,
  logError,
  logSummary,
} = require("../utils/logger");

/**
 * Extracts the Cloudinary Public ID from a Cloudinary image URL.
 * Handles versions (v12345), transformations (c_fill,w_800), signed URLs, and file extensions.
 *
 * @param {string} url - The Cloudinary image URL
 * @returns {string} The extracted public ID or clean filename fallback
 */
const extractCloudinaryPublicId = (url) => {
  if (!url || typeof url !== "string") return "";

  try {
    // 1. Strip query string (e.g. ?_a=...)
    const cleanUrl = url.split("?")[0];

    // 2. Check for Cloudinary /upload/ pattern
    const uploadIndex = cleanUrl.indexOf("/upload/");
    if (uploadIndex === -1) {
      // Fallback for non-Cloudinary or local image paths
      return cleanUrl.replace(/^.*[\\/]/, "").replace(/\.[^/.]+$/, "");
    }

    // 3. Extract path relative to /upload/
    let pathAfterUpload = cleanUrl.substring(uploadIndex + "/upload/".length);

    // 4. Strip file extensions (.jpg, .jpeg, .png, .webp, .avif, etc.)
    const lastDotIndex = pathAfterUpload.lastIndexOf(".");
    const lastSlashIndex = pathAfterUpload.lastIndexOf("/");

    if (lastDotIndex > lastSlashIndex) {
      pathAfterUpload = pathAfterUpload.substring(0, lastDotIndex);
    }

    // 5. Filter out version numbers (v12345), signatures (s--...--), and transformation parameters
    const parts = pathAfterUpload.split("/").filter((part) => {
      if (!part) return false;
      if (/^v\d+$/.test(part)) return false;
      if (/^s--.*--$/.test(part)) return false;
      if (/^(c_|w_|h_|q_|f_|e_|r_|b_|g_|dpr_|fl_|l_|u_)/.test(part)) return false;
      return true;
    });

    // 6. Return decoded public ID
    return decodeURIComponent(parts.join("/"));
  } catch (err) {
    return "";
  }
};

/**
 * Normalizes a single image value (string or object) to the new object format.
 *
 * @param {string|Object} imgVal - Legacy URL string or already migrated object
 * @param {string} defaultAlt - Default alt text if missing
 * @returns {Object|null} Formatted image object { publicId, secureUrl, alt }
 */
const normalizeImageObject = (imgVal, defaultAlt) => {
  if (!imgVal) return null;

  // Case A: Already migrated object
  if (typeof imgVal === "object" && imgVal !== null) {
    const secureUrl = imgVal.secureUrl || imgVal.url || "";
    const publicId = imgVal.publicId || extractCloudinaryPublicId(secureUrl);
    const alt = imgVal.alt || defaultAlt;

    return {
      publicId,
      secureUrl,
      alt,
    };
  }

  // Case B: Legacy string URL
  if (typeof imgVal === "string" && imgVal.trim().length > 0) {
    const secureUrl = imgVal.trim();
    const publicId = extractCloudinaryPublicId(secureUrl);
    const alt = defaultAlt;

    return {
      publicId,
      secureUrl,
      alt,
    };
  }

  return null;
};

/**
 * Checks if a tour document has already been fully migrated.
 *
 * @param {Object} tour - Lean or Mongoose Tour document
 * @returns {boolean} True if both cover and gallery images are already objects with publicId
 */
const isTourMigrated = (tour) => {
  const isCoverMigrated =
    tour.imageCover &&
    typeof tour.imageCover === "object" &&
    Boolean(tour.imageCover.publicId && tour.imageCover.secureUrl);

  const isGalleryMigrated =
    Array.isArray(tour.images) &&
    tour.images.length > 0 &&
    tour.images.every(
      (img) => img && typeof img === "object" && Boolean(img.publicId && img.secureUrl),
    );

  // If cover is missing or already migrated, check gallery
  return isCoverMigrated && (tour.images.length === 0 || isGalleryMigrated);
};

/**
 * Main Migration Function
 */
const migrateTourImages = async () => {
  const stats = {
    total: 0,
    migrated: 0,
    skipped: 0,
    failed: 0,
    startTime: Date.now(),
  };

  try {
    logBanner("MIGRATING TOUR IMAGES TO STRUCTURED SCHEMA");

    // 1. Connect to database
    const DB = process.env.DATABASE.replace(
      "<PASSWORD>",
      process.env.DATABASE_PASSWORD,
    );

    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logInfo("Connected to MongoDB Atlas.");

    // 2. Fetch all raw tour documents (using lean queries to read current raw structure)
    const tours = await Tour.find({}).lean();
    stats.total = tours.length;
    logInfo(`Found ${tours.length} tour documents to inspect.`);

    for (const tour of tours) {
      const tourName = tour.name || "Tour";

      // 3. Skip already migrated documents (Idempotency check)
      if (isTourMigrated(tour)) {
        logInfo(`Skipping "${tourName}" (Already migrated).`);
        stats.skipped++;
        continue;
      }

      try {
        let isModified = false;
        const updatePayload = {};

        // 4. Migrate imageCover
        if (tour.imageCover) {
          const coverAlt = `${tourName} Cover Image`;
          const normalizedCover = normalizeImageObject(tour.imageCover, coverAlt);
          if (normalizedCover) {
            updatePayload.imageCover = normalizedCover;
            isModified = true;
          }
        }

        // 5. Migrate images gallery array
        if (Array.isArray(tour.images) && tour.images.length > 0) {
          const normalizedGallery = tour.images
            .map((img, index) => {
              const galleryAlt = `${tourName} Gallery Image ${index + 1}`;
              return normalizeImageObject(img, galleryAlt);
            })
            .filter(Boolean);

          updatePayload.images = normalizedGallery;
          isModified = true;
        }

        // 6. Persist changes to MongoDB if updates were performed
        if (isModified) {
          await Tour.updateOne(
            { _id: tour._id },
            { $set: updatePayload },
            { runValidators: true },
          );
          stats.migrated++;
          logSuccess(`Migrated "${tourName}" successfully.`);
        } else {
          stats.skipped++;
        }
      } catch (err) {
        stats.failed++;
        logError(`Failed to migrate tour "${tourName}":`, err.message || err);
      }
    }

    // Summary calculation
    const elapsedSeconds = Math.floor((Date.now() - stats.startTime) / 1000);
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    stats.duration = `${mins}m ${secs}s`;

    logSummary({
      total: stats.total,
      migrated: stats.migrated,
      skipped: stats.skipped,
      failed: stats.failed,
      duration: stats.duration,
    });

    await mongoose.connection.close();
    logInfo("Database connection closed cleanly.");
    process.exit(0);
  } catch (err) {
    logError("Fatal error during migration:", err);
    process.exit(1);
  }
};

// Execute script if invoked directly from CLI
if (require.main === module) {
  migrateTourImages();
}

module.exports = {
  extractCloudinaryPublicId,
  normalizeImageObject,
  isTourMigrated,
  migrateTourImages,
};
