/**
 * Formats a Cloudinary image URL for optimal loading, width scaling, and browser cache busting.
 * - Adds w_{width},c_limit,f_auto,q_auto Cloudinary transformations for format, quality, and resolution limit.
 * - Strips legacy static version hashes (/v1234567/) so browser fetches the latest overwritten image.
 *
 * @param {string|Object} img - Cloudinary URL string or image object { secureUrl, url }
 * @param {number} [width=1200] - Maximum image width limit for crisp display
 * @returns {string} Optimized URL string
 */
export const getOptimizedImageUrl = (img, width = 1200) => {
  if (!img) return "";

  let rawUrl = "";
  if (typeof img === "string") {
    rawUrl = img.trim();
  } else if (typeof img === "object") {
    rawUrl = img.secureUrl || img.url || "";
  }

  if (!rawUrl) return "";

  // Handle Cloudinary specific transformation & cache busting
  if (rawUrl.includes("res.cloudinary.com") && rawUrl.includes("/upload/")) {
    // Replace static version stamps or existing f_auto/upload tags with width-limited f_auto,q_auto
    let cleanUrl = rawUrl.replace(
      /\/upload\/(?:(?:w_\d+,c_\w+,)?f_auto,q_auto\/|v\d+\/)?/,
      `/upload/w_${width},c_limit,f_auto,q_auto/`
    );
    return cleanUrl;
  }

  return rawUrl;
};
