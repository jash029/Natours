/**
 * Autonomous Production-Ready Tour Image Harvesting & Processing Pipeline
 * 
 * Usage:
 *   node src/scripts/uploadTourImages.js
 */
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../../config.env") });

const {
  logBanner,
  logInfo,
  logSuccess,
  logWarn,
  logError,
  logSummary,
} = require("../utils/logger");
const { toSlug } = require("../utils/slug");
const { isDuplicateImage } = require("../utils/imageHash");
const { searchImagesForTour } = require("../services/imageSearch.service");
const { downloadAndValidateImage } = require("../services/imageDownloader.service");
const { optimizeImage } = require("../services/imageOptimizer.service");
const { uploadCoverImage, uploadGalleryImage } = require("../services/cloudinary.service");
const {
  connectDB,
  fetchAllTours,
  shouldSkipTour,
  updateTourImagesInDB,
} = require("../services/mongo.service");

// Pipeline execution stats
const stats = {
  total: 0,
  completed: 0,
  skipped: 0,
  failed: 0,
  imagesUploaded: 0,
  startTime: Date.now(),
};

const failedToursReport = [];

/**
 * Process a single tour through the image pipeline
 * @param {Object} tour 
 */
const processSingleTour = async (tour) => {
  const tourName = tour.name || "Tour";
  const country = tour.destinations?.[0]?.country || tour.country || "global";
  const theme = tour.theme || "general";
  const slug = tour.slug || toSlug(tourName);

  logBanner(tourName);
  logInfo(`Country : ${country}`);
  logInfo(`Theme   : ${theme}`);
  logInfo("Searching high-resolution images...");

  // 1. Search candidate images across multi-source engine
  const candidates = await searchImagesForTour(tour);
  logInfo(`Found ${candidates.length} candidate images.`);

  if (candidates.length < 6) {
    logWarn(`Fewer than 6 candidate images found for "${tourName}". Expanding search...`);
  }

  const selectedBuffers = [];
  const existingHashes = [];

  // 2. Download, validate, deduplicate & optimize 6 unique images (1 Cover + 5 Gallery)
  for (const candidate of candidates) {
    if (selectedBuffers.length >= 6) break;

    const downloaded = await downloadAndValidateImage(candidate.url);
    if (!downloaded) continue;

    // Check duplicate hash
    const { isDuplicate, hash } = await isDuplicateImage(
      downloaded.buffer,
      existingHashes,
      12, // Hamming distance threshold
    );

    if (isDuplicate) {
      logWarn(`Skipped visual duplicate image for "${tourName}".`);
      continue;
    }

    // Optimize with Sharp
    const optimizedBuffer = await optimizeImage(downloaded.buffer, {
      maxWidth: 2560,
      maxHeight: 1440,
      quality: 90,
    });

    selectedBuffers.push(optimizedBuffer);
    if (hash) existingHashes.push(hash);
  }

  if (selectedBuffers.length < 6) {
    throw new Error(
      `Could only acquire ${selectedBuffers.length}/6 suitable images for "${tourName}".`,
    );
  }

  logInfo(`Selected & optimized ${selectedBuffers.length} unique images. Uploading to Cloudinary...`);

  const tourInfo = { theme, country, slug, name: tourName };

  // 3. Upload Cover Image (Buffer #0)
  const coverImage = await uploadCoverImage(selectedBuffers[0], tourInfo);
  stats.imagesUploaded++;

  // 4. Upload Gallery Images (Buffers #1 to #5)
  const galleryImages = [];
  for (let i = 1; i <= 5; i++) {
    const galleryImage = await uploadGalleryImage(selectedBuffers[i], i, tourInfo);
    galleryImages.push(galleryImage);
    stats.imagesUploaded++;
  }

  logInfo("Updating MongoDB document...");

  // 5. Update MongoDB Tour document
  await updateTourImagesInDB(tour._id, coverImage, galleryImages);

  stats.completed++;
  logSuccess(`Success: "${tourName}" updated with 1 cover + 5 gallery images!`);
};

/**
 * Concurrent Worker Pool for processing tours
 */
const runBatchPool = async (toursList, concurrency = 3) => {
  let index = 0;

  const worker = async () => {
    while (index < toursList.length) {
      const currentIndex = index++;
      const tour = toursList[currentIndex];

      if (shouldSkipTour(tour)) {
        logInfo(`Skipping "${tour.name}" (Already has cover and 5 gallery images).`);
        stats.skipped++;
        continue;
      }

      try {
        await processSingleTour(tour);
      } catch (err) {
        stats.failed++;
        logError(`Failed to process tour "${tour.name}":`, err);
        failedToursReport.push({
          id: tour._id,
          name: tour.name,
          country: tour.country || tour.destinations?.[0]?.country,
          theme: tour.theme,
          reason: err.message || String(err),
        });
      }
    }
  };

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
};

/**
 * Main Execution Function
 */
const main = async () => {
  try {
    logBanner("AUTONOMOUS TOUR IMAGE HARVESTING PIPELINE");
    await connectDB();

    const tours = await fetchAllTours();
    stats.total = tours.length;
    logInfo(`Loaded ${tours.length} total tours from database.`);

    if (tours.length === 0) {
      logWarn("No tours found in database. Run 'npm run import:data' first.");
      process.exit(0);
    }

    // Run pipeline with concurrency limit of 3
    await runBatchPool(tours, 3);

    // Save failed tours report if any failures occurred
    if (failedToursReport.length > 0) {
      const reportPath = path.join(__dirname, "../../failedTours.json");
      fs.writeFileSync(reportPath, JSON.stringify(failedToursReport, null, 2));
      logWarn(`Failed tours report written to ${reportPath}`);
    }

    // Compute execution duration
    const elapsedSeconds = Math.floor((Date.now() - stats.startTime) / 1000);
    const mins = Math.floor(elapsedSeconds / 60);
    const secs = elapsedSeconds % 60;
    stats.duration = `${mins}m ${secs}s`;

    logSummary(stats);
    process.exit(0);
  } catch (err) {
    logError("Fatal pipeline error:", err);
    process.exit(1);
  }
};

main();
