/**
 * Image Downloader & Validation Service
 * Downloads image buffers with retry handling, rate-limit backoff, size validation, and orientation checks.
 */
const axios = require("axios");
const sharp = require("sharp");
const { retryAsync, sleep } = require("../utils/retry");
const { logWarn } = require("../utils/logger");

/**
 * Download and validate an image buffer from a remote URL
 * @param {String} imageUrl 
 * @returns {Promise<{ buffer: Buffer, metadata: Object } | null>}
 */
const downloadAndValidateImage = async (imageUrl) => {
  if (!imageUrl) return null;

  try {
    const buffer = await retryAsync(
      async (attempt) => {
        const response = await axios.get(imageUrl, {
          responseType: "arraybuffer",
          timeout: 15000,
          headers: {
            "User-Agent":
              "NatoursTravelApp/1.0 (https://natours.com; contact: admin@natours.com)",
            Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          },
        });
        return Buffer.from(response.data);
      },
      3, // 3 retries
      1500, // 1.5s base delay
    );

    // Validate with Sharp
    const metadata = await sharp(buffer).metadata();

    // Rejection filters:
    // 1. Must be a valid image format
    if (!["jpeg", "png", "webp", "tiff"].includes(metadata.format)) {
      return null;
    }

    // 2. Minimum resolution: width >= 1000px
    if ((metadata.width || 0) < 1000) {
      return null;
    }

    // 3. Orientation requirement: Landscape (width >= height)
    if (metadata.width && metadata.height && metadata.width < metadata.height) {
      return null;
    }

    // Small delay to respect rate limits
    await sleep(200);

    return {
      buffer,
      metadata,
    };
  } catch (err) {
    if (err.response?.status === 429) {
      logWarn(`HTTP 429 Rate Limit encountered for ${imageUrl}. Backing off...`);
      await sleep(2000);
    } else {
      logWarn(`Failed to download image from URL (${imageUrl}): ${err.message}`);
    }
    return null;
  }
};

module.exports = {
  downloadAndValidateImage,
};
