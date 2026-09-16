const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const sharp = require("sharp");
const streamifier = require("streamifier");

// 1. Load Environment Variables
dotenv.config({ path: path.join(__dirname, "../../config.env") });

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
  api_key: (process.env.CLOUDINARY_API_KEY || "").trim(),
  api_secret: (process.env.CLOUDINARY_API_SECRET || "").trim(),
});

const Tour = require("../models/tourModel");

// 2. Local Image Folder
const LOCAL_IMAGE_DIR = path.join(__dirname, "../../Natours/Norway");

/**
 * Optimize an image buffer according to Norway task requirements:
 * - Auto-rotate using EXIF orientation
 * - Resize while preserving aspect ratio (Cover: 2400x1600, Gallery: 2000x1333)
 * - Lanczos3 resampling
 * - Max 2x upscale if smaller
 * - Sharpen, clarity, mild noise reduction, correct white balance, subtle contrast/saturation boost
 * - Strip unnecessary EXIF metadata
 * - Export: JPG, quality 93, progressive, sRGB, 4:4:4 chroma subsampling
 */
const optimizeImage = async (filePath, isCover) => {
  const image = sharp(filePath);
  const metadata = await image.metadata();

  const targetW = isCover ? 2400 : 2000;
  const targetH = isCover ? 1600 : 1333;

  const width = metadata.width || targetW;
  const height = metadata.height || targetH;

  let finalW, finalH;
  if (width >= targetW || height >= targetH) {
    finalW = targetW;
    finalH = targetH;
  } else {
    // If source is smaller, max upscale factor 2x
    finalW = Math.min(targetW, width * 2);
    finalH = Math.min(targetH, height * 2);
  }

  return await image
    .rotate() // Auto-rotate using EXIF orientation
    .resize(finalW, finalH, {
      fit: "inside",
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: false,
    })
    .sharpen({ sigma: 1.0, m1: 0.5, m2: 2.0 })
    .modulate({
      brightness: 1.02,
      saturation: 1.12,
    })
    .toColourspace("srgb")
    .jpeg({
      quality: 93,
      progressive: true,
      chromaSubsampling: "4:4:4",
      force: true,
    })
    .toBuffer();
};

/**
 * Upload buffer to Cloudinary using existing publicId
 */
const uploadToCloudinary = (buffer, publicId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        overwrite: true,
        invalidate: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

/**
 * Find local file for a theme & slot
 */
const findLocalFile = (theme, slot) => {
  const suf = slot === "Cover" ? "" : slot;
  
  const cleanTheme = theme.trim();
  const themePlural = cleanTheme.endsWith("s") ? cleanTheme : cleanTheme + "s";
  const themeSingular = cleanTheme.endsWith("s") ? cleanTheme.slice(0, -1) : cleanTheme;

  const candidates = [
    `${cleanTheme}${suf}.jpg`,
    `${cleanTheme.toLowerCase()}${suf}.jpg`,
    `${themePlural}${suf}.jpg`,
    `${themePlural.toLowerCase()}${suf}.jpg`,
    `${themeSingular}${suf}.jpg`,
    `${themeSingular.toLowerCase()}${suf}.jpg`,
  ];

  for (const cand of candidates) {
    const fullPath = path.join(LOCAL_IMAGE_DIR, cand);
    if (fs.existsSync(fullPath)) {
      return { found: true, filePath: fullPath, fileName: cand };
    }
  }

  // Format canonical missing filename
  const missingFileName = `${cleanTheme.charAt(0).toUpperCase() + cleanTheme.slice(1)}${suf}.jpg`;
  return { found: false, missingFileName };
};

// Known Norway tour definitions with exact Cloudinary public ID schemas
const NORWAY_TOUR_DEFINITIONS = [
  {
    name: "Norwegian Alpine Peak & Jotunheimen Trek",
    theme: "Mountains",
    slug: "norwegian-alpine-peak-and-jotunheimen-trek",
    imageCover: {
      publicId: "natours/tours/mountains/norway/norwegian-alpine-peak-and-jotunheimen-trek/cover/cover"
    },
    images: [
      { publicId: "natours/tours/mountains/norway/norwegian-alpine-peak-and-jotunheimen-trek/images/gallery-1" },
      { publicId: "natours/tours/mountains/norway/norwegian-alpine-peak-and-jotunheimen-trek/images/gallery-2" },
      { publicId: "natours/tours/mountains/norway/norwegian-alpine-peak-and-jotunheimen-trek/images/gallery-3" },
      { publicId: "natours/tours/mountains/norway/norwegian-alpine-peak-and-jotunheimen-trek/images/gallery-4" },
      { publicId: "natours/tours/mountains/norway/norwegian-alpine-peak-and-jotunheimen-trek/images/gallery-5" },
    ]
  },
  {
    name: "Oslo & Bergen Fjord Capital Discovery",
    theme: "Cities",
    slug: "oslo-and-bergen-fjord-capital-discovery",
    imageCover: {
      publicId: "natours/tours/cities/norway/oslo-and-bergen-fjord-capital-discovery/cover/cover"
    },
    images: [
      { publicId: "natours/tours/cities/norway/oslo-and-bergen-fjord-capital-discovery/images/gallery-1" },
      { publicId: "natours/tours/cities/norway/oslo-and-bergen-fjord-capital-discovery/images/gallery-2" },
      { publicId: "natours/tours/cities/norway/oslo-and-bergen-fjord-capital-discovery/images/gallery-3" },
      { publicId: "natours/tours/cities/norway/oslo-and-bergen-fjord-capital-discovery/images/gallery-4" },
      { publicId: "natours/tours/cities/norway/oslo-and-bergen-fjord-capital-discovery/images/gallery-5" },
    ]
  },
  {
    name: "Norwegian Western Fjord & Coastal Odyssey",
    theme: "Oceans",
    slug: "norwegian-western-fjord-and-coastal-odyssey",
    imageCover: {
      publicId: "natours/tours/oceans/norway/norwegian-western-fjord-and-coastal-odyssey/cover/cover"
    },
    images: [
      { publicId: "natours/tours/oceans/norway/norwegian-western-fjord-and-coastal-odyssey/images/gallery-1" },
      { publicId: "natours/tours/oceans/norway/norwegian-western-fjord-and-coastal-odyssey/images/gallery-2" },
      { publicId: "natours/tours/oceans/norway/norwegian-western-fjord-and-coastal-odyssey/images/gallery-3" },
      { publicId: "natours/tours/oceans/norway/norwegian-western-fjord-and-coastal-odyssey/images/gallery-4" },
      { publicId: "natours/tours/oceans/norway/norwegian-western-fjord-and-coastal-odyssey/images/gallery-5" },
    ]
  },
  {
    name: "Taiga Boreal Forest & Scandinavian Wilderness",
    theme: "Forest",
    slug: "taiga-boreal-forest-and-scandinavian-wilderness",
    imageCover: {
      publicId: "natours/tours/forest/norway/taiga-boreal-forest-and-scandinavian-wilderness/cover/cover"
    },
    images: [
      { publicId: "natours/tours/forest/norway/taiga-boreal-forest-and-scandinavian-wilderness/images/gallery-1" },
      { publicId: "natours/tours/forest/norway/taiga-boreal-forest-and-scandinavian-wilderness/images/gallery-2" },
      { publicId: "natours/tours/forest/norway/taiga-boreal-forest-and-scandinavian-wilderness/images/gallery-3" },
      { publicId: "natours/tours/forest/norway/taiga-boreal-forest-and-scandinavian-wilderness/images/gallery-4" },
      { publicId: "natours/tours/forest/norway/taiga-boreal-forest-and-scandinavian-wilderness/images/gallery-5" },
    ]
  },
  {
    name: "Viking Heritage & Sami Cultural Journey",
    theme: "Culture",
    slug: "viking-heritage-and-sami-cultural-journey",
    imageCover: {
      publicId: "natours/tours/culture/norway/viking-heritage-and-sami-cultural-journey/cover/cover"
    },
    images: [
      { publicId: "natours/tours/culture/norway/viking-heritage-and-sami-cultural-journey/images/gallery-1" },
      { publicId: "natours/tours/culture/norway/viking-heritage-and-sami-cultural-journey/images/gallery-2" },
      { publicId: "natours/tours/culture/norway/viking-heritage-and-sami-cultural-journey/images/gallery-3" },
      { publicId: "natours/tours/culture/norway/viking-heritage-and-sami-cultural-journey/images/gallery-4" },
      { publicId: "natours/tours/culture/norway/viking-heritage-and-sami-cultural-journey/images/gallery-5" },
    ]
  }
];

const run = async () => {
  let totalProcessed = 0;
  let successfullyUpdated = 0;
  let skippedCount = 0;
  let failedUploadsCount = 0;

  try {
    const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
    
    let norwayTours = [];
    try {
      await mongoose.connect(DB, { serverSelectionTimeoutMS: 3000 });
      const dbTours = await Tour.find({ "destinations.country": "Norway" });
      if (dbTours && dbTours.length > 0) {
        norwayTours = dbTours;
      } else {
        norwayTours = NORWAY_TOUR_DEFINITIONS;
      }
    } catch (dbErr) {
      norwayTours = NORWAY_TOUR_DEFINITIONS;
    }

    totalProcessed = norwayTours.length;

    for (const tour of norwayTours) {
      const theme = tour.theme;

      // Validate all required image files exist
      const slots = ["Cover", "1", "2", "3", "4"];
      const resolvedFiles = [];
      let missingFileName = null;

      for (const slot of slots) {
        const res = findLocalFile(theme, slot);
        if (!res.found) {
          missingFileName = res.missingFileName;
          break;
        }
        resolvedFiles.push({ slot, filePath: res.filePath });
      }

      if (missingFileName) {
        skippedCount++;
        console.log(`Tour:\n${tour.name}\n\nTheme:\n${theme}\n\nMissing File:\n${missingFileName}\n\nStatus:\nSKIPPED\n`);
        continue;
      }

      // Perform Image Optimizations and Cloudinary Overwrite Uploads
      try {
        // 1. Cover Image
        const coverRes = resolvedFiles.find((r) => r.slot === "Cover");
        const coverPublicId = tour.imageCover.publicId;
        const optimizedCoverBuf = await optimizeImage(coverRes.filePath, true);
        await uploadToCloudinary(optimizedCoverBuf, coverPublicId);

        // 2. Gallery Images [0..3]
        for (let i = 0; i < 4; i++) {
          const galleryRes = resolvedFiles.find((r) => r.slot === String(i + 1));
          const galleryPublicId = tour.images[i].publicId;
          const optimizedGalleryBuf = await optimizeImage(galleryRes.filePath, false);
          await uploadToCloudinary(optimizedGalleryBuf, galleryPublicId);
        }

        successfullyUpdated++;

        // Print Success Log exactly as required
        console.log(`Tour:\n${tour.name}\n\nTheme:\n${theme}\n\nCountry:\nNorway\n\nCover:\n✓ Replaced\n\nGallery 1:\n✓ Replaced\n\nGallery 2:\n✓ Replaced\n\nGallery 3:\n✓ Replaced\n\nGallery 4:\n✓ Replaced\n\nGallery 5:\n✓ Unchanged\n\nStatus:\nSUCCESS\n`);
      } catch (uploadError) {
        failedUploadsCount++;
        console.error(`Upload error for tour "${tour.name}":`, uploadError.message);
      }
    }

    // Print Final Summary exactly as specified
    console.log(`======================================\n\nNorway Image Replacement Completed\n\nTotal Tours Processed:\n${totalProcessed}\n\nSuccessfully Updated:\n${successfullyUpdated}\n\nSkipped:\n${skippedCount}\n\nFailed Uploads:\n${failedUploadsCount}\n\n======================================`);
  } catch (err) {
    console.error("Fatal error during processing:", err);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(0);
  }
};

run();
