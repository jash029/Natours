/**
 * Perceptual Image Hashing & Duplicate Image Detection Utility using Sharp
 */
const sharp = require("sharp");

/**
 * Computes 64-bit Average Hash (aHash) for an image buffer
 * @param {Buffer} imageBuffer 
 * @returns {Promise<String>} 64-character binary string
 */
const computePerceptualHash = async (imageBuffer) => {
  try {
    const rawPixels = await sharp(imageBuffer)
      .resize(8, 8, { fit: "fill" })
      .grayscale()
      .raw()
      .toBuffer();

    let sum = 0;
    for (let i = 0; i < rawPixels.length; i++) {
      sum += rawPixels[i];
    }
    const avg = sum / rawPixels.length;

    let hash = "";
    for (let i = 0; i < rawPixels.length; i++) {
      hash += rawPixels[i] >= avg ? "1" : "0";
    }

    return hash;
  } catch (err) {
    return null;
  }
};

/**
 * Calculates Hamming distance between two binary hash strings
 * @param {String} hash1 
 * @param {String} hash2 
 * @returns {Number} Number of differing bits
 */
const hammingDistance = (hash1, hash2) => {
  if (!hash1 || !hash2 || hash1.length !== hash2.length) return 64;
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) {
      distance++;
    }
  }
  return distance;
};

/**
 * Checks if a candidate image buffer is a duplicate compared to an array of existing image hashes
 * @param {Buffer} candidateBuffer 
 * @param {Array<String>} existingHashes 
 * @param {Number} [threshold=12] Max Hamming distance to consider a duplicate
 * @returns {Promise<{ isDuplicate: Boolean, hash: String }>}
 */
const isDuplicateImage = async (candidateBuffer, existingHashes = [], threshold = 12) => {
  const hash = await computePerceptualHash(candidateBuffer);
  if (!hash) return { isDuplicate: false, hash: null };

  for (const existingHash of existingHashes) {
    if (existingHash && hammingDistance(hash, existingHash) <= threshold) {
      return { isDuplicate: true, hash };
    }
  }

  return { isDuplicate: false, hash };
};

module.exports = {
  computePerceptualHash,
  hammingDistance,
  isDuplicateImage,
};
