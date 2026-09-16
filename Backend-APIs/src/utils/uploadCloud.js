const sharp = require("sharp");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const AppError = require("./appError");

// =======================================================
// GENERIC IMAGE UPLOAD
// =======================================================

const uploadToCloudinary = (
  buffer,
  folder = "natours/users",
  publicId = null,
  options = {},
) => {
  const uploadOptions = {
    folder,
    resource_type: "image",
    quality: "auto",
    fetch_format: "auto",
    overwrite: true,
    ...options,
  };

  if (publicId) {
    uploadOptions.public_id = publicId;
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);

        resolve({
          publicId: result.public_id,
          secureUrl: result.secure_url,
          public_id: result.public_id,
          secure_url: result.secure_url,
          width: result.width,
          height: result.height,
        });
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error(`Cloudinary delete failed for ${publicId}:`, err);
  }
};

// =======================================================
// SHARP IMAGE PROCESSING HELPERS
// =======================================================

/**
 * Resize, convert to jpeg, compress, and strip metadata using Sharp
 */
const processCoverImage = async (buffer) => {
  try {
    return await sharp(buffer)
      .resize(2000, 1333, { fit: "cover" })
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .withMetadata(false)
      .toBuffer();
  } catch (err) {
    throw new AppError("Error processing cover image with Sharp.", 500);
  }
};

const processGalleryImage = async (buffer) => {
  try {
    return await sharp(buffer)
      .resize(2000, 1333, { fit: "cover" })
      .toFormat("jpeg")
      .jpeg({ quality: 85 })
      .withMetadata(false)
      .toBuffer();
  } catch (err) {
    throw new AppError("Error processing gallery image with Sharp.", 500);
  }
};

// =======================================================
// TOUR MEDIA UPLOAD SYSTEM (PERMANENT _id FOLDER STRUCTURE)
// =======================================================

/**
 * Upload single cover image to Natours/tours/<tourId>/cover/cover.jpg
 */
const uploadTourCoverImage = async (fileBuffer, tourId) => {
  if (!tourId) {
    throw new AppError("Tour ID is required for image upload.", 500);
  }

  const processedBuffer = await processCoverImage(fileBuffer);
  const folder = `Natours/tours/${tourId}/cover`;

  const result = await uploadToCloudinary(processedBuffer, folder, "cover");
  return result.secureUrl;
};

/**
 * Upload gallery images to Natours/tours/<tourId>/gallery/image-X.jpg (Max 5)
 */
const uploadTourGalleryImages = async (galleryFiles = [], tourId) => {
  if (!tourId) {
    throw new AppError("Tour ID is required for image upload.", 500);
  }

  if (galleryFiles.length > 5) {
    throw new AppError("Maximum 5 gallery images are allowed.", 400);
  }

  const folder = `Natours/tours/${tourId}/gallery`;

  const uploadPromises = galleryFiles.map(async (file, index) => {
    const processedBuffer = await processGalleryImage(file.buffer);
    const publicId = `image-${index + 1}`;
    const result = await uploadToCloudinary(processedBuffer, folder, publicId);
    return result.secureUrl;
  });

  return await Promise.all(uploadPromises);
};

/**
 * Completely clean up all Cloudinary assets under Natours/tours/<tourId>/
 */
const deleteTourFolder = async (tourId) => {
  if (!tourId) return;

  const prefix = `Natours/tours/${tourId}/`;

  try {
    // Delete all resources under Natours/tours/<tourId>/
    await cloudinary.api.delete_resources_by_prefix(prefix);

    // Delete sub-folders
    try {
      await cloudinary.api.delete_folder(`${prefix}cover`);
    } catch (e) {}

    try {
      await cloudinary.api.delete_folder(`${prefix}gallery`);
    } catch (e) {}

    try {
      await cloudinary.api.delete_folder(`Natours/tours/${tourId}`);
    } catch (e) {}
  } catch (err) {
    console.error(`Failed to delete Cloudinary tour folder (${tourId}):`, err);
  }
};

/**
 * Delete cover image asset
 */
const deleteTourCover = async (tourId) => {
  if (!tourId) return;
  await deleteFromCloudinary(`Natours/tours/${tourId}/cover/cover`);
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  processCoverImage,
  processGalleryImage,
  uploadTourCoverImage,
  uploadTourGalleryImages,
  deleteTourFolder,
  deleteTourCover,
};
