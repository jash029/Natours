/**
 * Slug utility for generating lowercase URL-safe Cloudinary folder names
 */
const slugify = require("slugify");

/**
 * Convert string to lowercase, strict URL-safe slug
 * @param {String} text 
 * @returns {String}
 */
const toSlug = (text = "") => {
  if (!text) return "default";
  return slugify(String(text), {
    lower: true,
    strict: true,
    trim: true,
  });
};

module.exports = {
  toSlug,
};
