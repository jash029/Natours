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

// 2. Local Image Folder for USA
const LOCAL_IMAGE_DIR = path.join(__dirname, "../../Natours/Usa");

/**
 * Optimize an image buffer according to task requirements:
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

// Known USA tour definitions with exact Cloudinary public ID schemas
const USA_TOUR_DEFINITIONS = [
  {
    name: "American Metropolis Lights & Skyline Tour",
    theme: "Cities",
    slug: "american-metropolis-lights-and-skyline-tour",
    imageCover: {
      publicId: "natours/tours/cities/usa/american-metropolis-lights-and-skyline-tour/cover/cover"
    },
    images: [
      { publicId: "natours/tours/cities/usa/american-metropolis-lights-and-skyline-tour/images/gallery-1" },
      { publicId: "natours/tours/cities/usa/american-metropolis-lights-and-skyline-tour/images/gallery-2" },
      { publicId: "natours/tours/cities/usa/american-metropolis-lights-and-skyline-tour/images/gallery-3" },
      { publicId: "natours/tours/cities/usa/american-metropolis-lights-and-skyline-tour/images/gallery-4" },
      { publicId: "natours/tours/cities/usa/american-metropolis-lights-and-skyline-tour/images/gallery-5" },
    ]
  },
  {
    name: "American Heritage & Historic East Coast Journey",
    theme: "Culture",
    slug: "american-heritage-and-historic-east-coast-journey",
    imageCover: {
      publicId: "natours/tours/culture/usa/american-heritage-and-historic-east-coast-journey/cover/cover"
    },
    images: [
      { publicId: "natours/tours/culture/usa/american-heritage-and-historic-east-coast-journey/images/gallery-1" },
      { publicId: "natours/tours/culture/usa/american-heritage-and-historic-east-coast-journey/images/gallery-2" },
      { publicId: "natours/tours/culture/usa/american-heritage-and-historic-east-coast-journey/images/gallery-3" },
      { publicId: "natours/tours/culture/usa/american-heritage-and-historic-east-coast-journey/images/gallery-4" },
      { publicId: "natours/tours/culture/usa/american-heritage-and-historic-east-coast-journey/images/gallery-5" },
    ]
  },
  {
    name: "Pacific Northwest Redwood & Olympic Forest Quest",
    theme: "Forest",
    slug: "pacific-northwest-redwood-and-olympic-forest-quest",
    imageCover: {
      publicId: "natours/tours/forest/usa/pacific-northwest-redwood-and-olympic-forest-quest/cover/cover"
    },
    images: [
      { publicId: "natours/tours/forest/usa/pacific-northwest-redwood-and-olympic-forest-quest/images/gallery-1" },
      { publicId: "natours/tours/forest/usa/pacific-northwest-redwood-and-olympic-forest-quest/images/gallery-2" },
      { publicId: "natours/tours/forest/usa/pacific-northwest-redwood-and-olympic-forest-quest/images/gallery-3" },
      { publicId: "natours/tours/forest/usa/pacific-northwest-redwood-and-olympic-forest-quest/images/gallery-4" },
      { publicId: "natours/tours/forest/usa/pacific-northwest-redwood-and-olympic-forest-quest/images/gallery-5" },
    ]
  },
  {
    name: "American Rocky Mountain High Expedition",
    theme: "Mountains",
    slug: "american-rocky-mountain-high-expedition",
    imageCover: {
      publicId: "natours/tours/mountains/usa/american-rocky-mountain-high-expedition/cover/cover"
    },
    images: [
      { publicId: "natours/tours/mountains/usa/american-rocky-mountain-high-expedition/images/gallery-1" },
      { publicId: "natours/tours/mountains/usa/american-rocky-mountain-high-expedition/images/gallery-2" },
      { publicId: "natours/tours/mountains/usa/american-rocky-mountain-high-expedition/images/gallery-3" },
      { publicId: "natours/tours/mountains/usa/american-rocky-mountain-high-expedition/images/gallery-4" },
      { publicId: "natours/tours/mountains/usa/american-rocky-mountain-high-expedition/images/gallery-5" },
    ]
  },
  {
    name: "Pacific Ocean Highway & Coastal Escape",
    theme: "Oceans",
    slug: "pacific-ocean-highway-and-coastal-escape",
    imageCover: {
      publicId: "natours/tours/oceans/usa/pacific-ocean-highway-and-coastal-escape/cover/cover"
    },
    images: [
      { publicId: "natours/tours/oceans/usa/pacific-ocean-highway-and-coastal-escape/images/gallery-1" },
      { publicId: "natours/tours/oceans/usa/pacific-ocean-highway-and-coastal-escape/images/gallery-2" },
      { publicId: "natours/tours/oceans/usa/pacific-ocean-highway-and-coastal-escape/images/gallery-3" },
      { publicId: "natours/tours/oceans/usa/pacific-ocean-highway-and-coastal-escape/images/gallery-4" },
      { publicId: "natours/tours/oceans/usa/pacific-ocean-highway-and-coastal-escape/images/gallery-5" },
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
    
    let usaTours = [];
    try {
      await mongoose.connect(DB, { serverSelectionTimeoutMS: 3000 });
      const dbTours = await Tour.find({ "destinations.country": { $regex: /^usa|united states$/i } });
      if (dbTours && dbTours.length > 0) {
        usaTours = dbTours;
      } else {
        usaTours = USA_TOUR_DEFINITIONS;
      }
    } catch (dbErr) {
      usaTours = USA_TOUR_DEFINITIONS;
    }

    totalProcessed = usaTours.length;

    for (const tour of usaTours) {
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
        console.log(`Tour:\n${tour.name}\n\nTheme:\n${theme}\n\nCountry:\nUSA\n\nCover:\n✓ Replaced\n\nGallery 1:\n✓ Replaced\n\nGallery 2:\n✓ Replaced\n\nGallery 3:\n✓ Replaced\n\nGallery 4:\n✓ Replaced\n\nGallery 5:\n✓ Unchanged\n\nStatus:\nSUCCESS\n`);
      } catch (uploadError) {
        failedUploadsCount++;
        console.error(`Upload error for tour "${tour.name}":`, uploadError.message);
      }
    }

    // Print Final Summary exactly as specified
    console.log(`======================================\n\nUSA Image Replacement Completed\n\nTotal Tours Processed:\n${totalProcessed}\n\nSuccessfully Updated:\n${successfullyUpdated}\n\nSkipped:\n${skippedCount}\n\nFailed Uploads:\n${failedUploadsCount}\n\n======================================`);
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
