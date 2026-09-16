/**
 * Async Retry Utility with Exponential Backoff
 */

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Executes an async function with up to maxAttempts retries
 * @param {Function} fn - Async operation to attempt
 * @param {Number} [maxAttempts=3] - Maximum retry count
 * @param {Number} [delayMs=1000] - Base delay in milliseconds
 * @returns {Promise<any>}
 */
const retryAsync = async (fn, maxAttempts = 3, delayMs = 1000) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts) {
        const backoff = delayMs * Math.pow(2, attempt - 1);
        await sleep(backoff);
      }
    }
  }

  throw lastError;
};

module.exports = {
  retryAsync,
  sleep,
};
