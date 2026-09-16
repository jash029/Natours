/**
 * MongoDB Service
 * Manages database connection, fetching tours, resume check, and selective document updates.
 */
const mongoose = require("mongoose");
const Tour = require("../models/tourModel");
const { logInfo, logError } = require("../utils/logger");

/**
 * Connect to MongoDB Atlas
 */
const connectDB = async () => {
  const DB = process.env.DATABASE.replace(
    "<PASSWORD>",
    process.env.DATABASE_PASSWORD,
  );

  await mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  logInfo("MongoDB Atlas connected successfully.");
};

/**
 * Fetch all tours from MongoDB
 * @returns {Promise<Array<Object>>}
 */
const fetchAllTours = async () => {
  return await Tour.find({});
};

/**
 * Check if a tour has complete images and can be skipped (Resume Support)
 * @param {Object} tour 
 * @returns {Boolean}
 */
const shouldSkipTour = (tour) => {
  const hasCover = Boolean(
    tour.imageCover &&
      (typeof tour.imageCover === "string"
        ? tour.imageCover.trim().length > 0
        : Boolean(tour.imageCover.secureUrl)),
  );
  const hasGallery = Array.isArray(tour.images) && tour.images.length === 5;
  return hasCover && hasGallery;
};

/**
 * Update ONLY imageCover and images fields for a Tour document
 * @param {String} tourId 
 * @param {String} imageCover 
 * @param {Array<String>} images 
 */
const updateTourImagesInDB = async (tourId, imageCover, images) => {
  await Tour.findByIdAndUpdate(
    tourId,
    {
      $set: {
        imageCover,
        images,
      },
    },
    {
      new: true,
      runValidators: false,
    },
  );
};

module.exports = {
  connectDB,
  fetchAllTours,
  shouldSkipTour,
  updateTourImagesInDB,
};
