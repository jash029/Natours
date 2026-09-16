/**
 * Image Optimizer Service using Sharp
 * Resizes, converts to JPEG 90, auto-rotates, and strips metadata.
 */
const sharp = require("sharp");

/**
 * Optimize image buffer for web delivery
 * @param {Buffer} buffer 
 * @param {Object} [options={}] 
 * @returns {Promise<Buffer>} Optimized JPEG image buffer
 */
const optimizeImage = async (buffer, options = {}) => {
  const maxWidth = options.maxWidth || 2560;
  const maxHeight = options.maxHeight || 1440;
  const quality = options.quality || 90;

  return await sharp(buffer)
    .rotate() // Auto rotate based on EXIF orientation
    .resize(maxWidth, maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .toFormat("jpeg")
    .jpeg({
      quality,
      chromaSubsampling: "4:4:4",
      force: true,
    })
    .withMetadata(false) // Remove metadata
    .toBuffer();
};

module.exports = {
  optimizeImage,
};
