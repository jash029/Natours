const sharp = require("sharp");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const { retryAsync } = require("../utils/retry");
const { toSlug } = require("../utils/slug");
const AppError = require("../utils/appError");

const getTourFolderPath = (tourInfo) => {
  if (!tourInfo) {
    return "natours/tours/cities/global/tour";
  }

  let themeVal = "cities";
  let countryVal = "global";
  let tourSlugVal = "tour";

  if (typeof tourInfo === "string") {
    tourSlugVal = tourInfo;
  } else if (typeof tourInfo === "object") {
    themeVal = tourInfo.theme || tourInfo.category || "cities";
    countryVal = tourInfo.country || tourInfo.destination || "global";
    tourSlugVal =
      tourInfo.slug ||
      tourInfo.name ||
      tourInfo.title ||
      tourInfo.id ||
      tourInfo._id ||
      "tour";
  }

  const safeTheme = toSlug(themeVal) || "cities";
  const safeCountry = toSlug(countryVal) || "global";
  const safeSlug = toSlug(tourSlugVal) || "tour";

  return `natours/tours/${safeTheme}/${safeCountry}/${safeSlug}`;
};

const uploadBufferToCloudinary = async (
  buffer,
  folderPath,
  publicId = null,
  options = {},
) => {
  return await retryAsync(
    async () => {
      return new Promise((resolve, reject) => {
        const uploadOptions = {
          folder: folderPath,
          resource_type: "image",
          quality: "auto",
          fetch_format: "auto",
          overwrite: true,
          ...options,
        };

        if (publicId) {
          uploadOptions.public_id = publicId;
        }

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
    },
    3,
    1000,
  );
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error(`Cloudinary delete failed for ${publicId}:`, err);
  }
};

const processCoverBuffer = async (buffer) => {
  try {
    return await sharp(buffer)
      .resize(2000, 1333, { fit: "cover" })
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .withMetadata(false)
      .toBuffer();
  } catch (err) {
    return buffer;
  }
};

const processGalleryBuffer = async (buffer) => {
  try {
    return await sharp(buffer)
      .resize(2000, 1333, { fit: "cover" })
      .toFormat("jpeg")
      .jpeg({ quality: 85 })
      .withMetadata(false)
      .toBuffer();
  } catch (err) {
    return buffer;
  }
};

const uploadCoverImage = async (buffer, tourInfo) => {
  if (!tourInfo) {
    throw new AppError("Tour context or ID is required for image upload.", 500);
  }

  const processedBuffer = await processCoverBuffer(buffer);
  const basePath = getTourFolderPath(tourInfo);
  const folderPath = `${basePath}/cover`;
  const tourName =
    typeof tourInfo === "object"
      ? tourInfo.name || tourInfo.title || "Tour"
      : "Tour";

  const result = await uploadBufferToCloudinary(
    processedBuffer,
    folderPath,
    "cover",
  );
  return {
    ...result,
    alt: `${tourName} Cover Image`,
  };
};

const uploadGalleryImage = async (buffer, index, tourInfo) => {
  if (!tourInfo) {
    throw new AppError("Tour context or ID is required for image upload.", 500);
  }

  const processedBuffer = await processGalleryBuffer(buffer);
  const basePath = getTourFolderPath(tourInfo);
  const folderPath = `${basePath}/images`;
  const publicId = `image-${index}`;
  const tourName =
    typeof tourInfo === "object"
      ? tourInfo.name || tourInfo.title || "Tour"
      : "Tour";

  const result = await uploadBufferToCloudinary(
    processedBuffer,
    folderPath,
    publicId,
  );
  return {
    ...result,
    alt: `${tourName} Image ${index}`,
  };
};

const uploadGalleryImages = async (galleryFiles = [], tourInfo) => {
  if (!tourInfo) {
    throw new AppError("Tour context or ID is required for image upload.", 500);
  }

  if (galleryFiles.length > 5) {
    throw new AppError("Maximum 5 gallery images are allowed.", 400);
  }

  const uploadPromises = galleryFiles.map(async (file, index) => {
    return await uploadGalleryImage(file.buffer, index + 1, tourInfo);
  });

  return await Promise.all(uploadPromises);
};

const deleteTourFolder = async (tourInfo) => {
  if (!tourInfo) return;

  const basePath = getTourFolderPath(tourInfo);
  const prefix = `${basePath}/`;

  try {
    await cloudinary.api.delete_resources_by_prefix(prefix);

    try {
      await cloudinary.api.delete_folder(`${prefix}cover`);
    } catch (e) {}

    try {
      await cloudinary.api.delete_folder(`${prefix}images`);
    } catch (e) {}

    try {
      await cloudinary.api.delete_folder(basePath);
    } catch (e) {}
  } catch (err) {
    console.error(
      `Failed to delete Cloudinary tour folder (${basePath}):`,
      err,
    );
  }
};

const deleteTourCover = async (tourInfo) => {
  if (!tourInfo) return;
  if (typeof tourInfo === "string" && tourInfo.includes("/")) {
    await deleteFromCloudinary(tourInfo);
  } else {
    const basePath = getTourFolderPath(tourInfo);
    await deleteFromCloudinary(`${basePath}/cover/cover`);
  }
};





module.exports = {
  getTourFolderPath,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
  processCoverBuffer,
  processGalleryBuffer,
  uploadCoverImage,
  uploadGalleryImage,
  uploadGalleryImages,
  deleteTourFolder,
  deleteTourCover,
};
