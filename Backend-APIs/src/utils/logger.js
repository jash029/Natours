/**
 * Formatting & Console Logging Utility for Autonomous Tour Image Pipeline
 */

const logBanner = (title) => {
  const line = "==================================================";
  console.log(`\n${line}`);
  console.log(`  ${title}`);
  console.log(`${line}\n`);
};

const logInfo = (msg) => {
  console.log(`[INFO] ${msg}`);
};

const logSuccess = (msg) => {
  console.log(`[SUCCESS] ✔ ${msg}`);
};

const logWarn = (msg) => {
  console.warn(`[WARN] ⚠ ${msg}`);
};

const logError = (msg, err = "") => {
  console.error(`[ERROR] ✖ ${msg}`, err ? err.message || err : "");
};

const logSummary = (stats) => {
  const line = "==================================================";
  console.log(`\n${line}`);
  console.log("             FINAL EXECUTION SUMMARY               ");
  console.log(line);
  console.log(`  Total Tours Found  : ${stats.total}`);
  console.log(`  Completed          : ${stats.completed}`);
  console.log(`  Skipped (Resumed)  : ${stats.skipped}`);
  console.log(`  Failed             : ${stats.failed}`);
  console.log(`  Total Images Uploaded : ${stats.imagesUploaded}`);
  console.log(`  Execution Time     : ${stats.duration}`);
  console.log(`${line}\n`);
};

module.exports = {
  logBanner,
  logInfo,
  logSuccess,
  logWarn,
  logError,
  logSummary,
};
