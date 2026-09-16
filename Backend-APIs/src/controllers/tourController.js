const mongoose = require("mongoose");
const Tour = require("../models/tourModel");
const catchAsync = require("../utils/error");
const AppError = require("../utils/appError");


// ==========================================
// GET ALL TOURS
// ==========================================
exports.getAllTours = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let query = Tour.find(JSON.parse(queryStr));

  // Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    query = query.select(fields);
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const reqLimit = parseInt(req.query.limit, 10) || 8;
  const limit = Math.min(reqLimit, 8);
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const tours = await query;

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

// ==========================================
// GET SINGLE TOUR BY ID OR SLUG
// ==========================================
exports.getTour = catchAsync(async (req, res, next) => {
  const identifier = req.params.slug || req.params.id;

  if (!identifier || identifier === "undefined") {
    return next(new AppError("Please provide a valid tour slug or ID", 400));
  }

  const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
  const query = isObjectId
    ? { $or: [{ _id: identifier }, { slug: identifier }] }
    : { slug: identifier };

  const tour = await Tour.findOne(query).lean();

  if (!tour) {
    return next(new AppError("No tour found with that identifier", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

// ==========================================
// CONSTANTS & REUSABLE CONFIGURATIONS
// ==========================================

const DEFAULT_LIMIT = 8;

const CARD_PROJECTION = {
  name: 1,
  slug: 1,
  summary: 1,
  theme: 1,
  imageCover: 1,
  startingPrice: 1,
  discount: 1,
  ratingsAverage: 1,
  ratingsQuantity: 1,
  duration: 1,
  destinations: 1,
  trending: 1,
};

const SORTS = {
  // Controller 1: Trending Tours
  TRENDING_DEFAULT: {
    ratingsAverage: -1,
    ratingsQuantity: -1,
    createdAt: -1,
  },
  // Controller 1, 2, 3: Discount Tours
  DISCOUNT: {
    discount: -1,
    ratingsAverage: -1,
    ratingsQuantity: -1,
  },
  // Controller 2: Theme Tours
  THEME_DEFAULT: {
    trending: -1,
    ratingsAverage: -1,
    ratingsQuantity: -1,
  },
  // Controller 3: Top Trending Tours
  TOP_TRENDING: {
    ratingsAverage: -1,
    ratingsQuantity: -1,
    discount: -1,
    createdAt: -1,
  },
  // Controller 4: Nature Theme Tours
  NATURE_THEME: {
    trending: -1,
    discount: -1,
    ratingsAverage: -1,
    ratingsQuantity: -1,
  },
  // Controller 5: Cities Theme Tours
  CITIES_THEME: {
    discount: -1,
    trending: -1,
    ratingsAverage: -1,
    ratingsQuantity: -1,
  },
};

const THEMES_ALL = ["Cities", "Mountains", "Oceans", "Forest", "Culture"];
const THEMES_NATURE = ["Mountains", "Oceans", "Forest"];

// ==========================================
// HELPER QUERY UTILITY
// ==========================================

/**
 * Helper to query published tours with card projection, sorting, and limit.
 * Uses .lean() for maximum query performance and minimal memory footprint.
 *
 * @param {Object} [filter={}] - Additional query criteria to merge with { status: "published" }
 * @param {Object} [sort={}] - Sorting parameters
 * @param {number} [limit=DEFAULT_LIMIT] - Limit count (defaults to 8)
 * @returns {Promise<Array>} Lean array of tour card objects
 */
const getPublishedTours = (filter = {}, sort = {}, limit = DEFAULT_LIMIT) => {
  return Tour.find({ status: "published", ...filter })
    .select(CARD_PROJECTION)
    .sort(sort)
    .limit(limit)
    .lean();
};

// ==========================================
// CONTROLLER 1: Trending & Discount Tours
// ==========================================
exports.getTrendingAndDiscountTours = catchAsync(async (req, res, next) => {
  const [trendingTours, discountTours] = await Promise.all([
    getPublishedTours({ trending: true }, SORTS.TRENDING_DEFAULT),
    getPublishedTours({ discount: { $gt: 0 } }, SORTS.DISCOUNT),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      trendingTours,
      discountTours,
    },
  });
});

// ==========================================
// CONTROLLER 2: Theme Tours & Discount Tours
// ==========================================
exports.getThemeToursAndDiscounts = catchAsync(async (req, res, next) => {
  const themePromises = THEMES_ALL.map((theme) =>
    getPublishedTours({ theme }, SORTS.THEME_DEFAULT),
  );

  const discountPromise = getPublishedTours(
    { discount: { $gt: 0 } },
    SORTS.DISCOUNT,
  );

  const results = await Promise.all([...themePromises, discountPromise]);

  const discountTours = results.pop();

  const themes = THEMES_ALL.reduce((acc, theme, index) => {
    acc[theme] = results[index];
    return acc;
  }, {});

  res.status(200).json({
    status: "success",
    data: {
      themes,
      discountTours,
    },
  });
});

// ==========================================
// CONTROLLER 3: Top Trending & Discount Tours
// ==========================================
exports.getTopTrendingTours = catchAsync(async (req, res, next) => {
  const [trendingTours, discountTours] = await Promise.all([
    getPublishedTours({ trending: true }, SORTS.TOP_TRENDING),
    getPublishedTours({ discount: { $gt: 0 } }, SORTS.DISCOUNT),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      trendingTours,
      discountTours,
    },
  });
});

// ==========================================
// CONTROLLER 4: Nature Theme Tours
// ==========================================
exports.getNatureThemeTours = catchAsync(async (req, res, next) => {
  const naturePromises = THEMES_NATURE.map((theme) =>
    getPublishedTours({ theme }, SORTS.NATURE_THEME),
  );

  const results = await Promise.all(naturePromises);

  const natureTours = results.flat().slice(0, 8);

  res.status(200).json({
    status: "success",
    data: {
      natureTours,
    },
  });
});

// ==========================================
// CONTROLLER 5: Cities Theme Tours
// ==========================================
exports.getCitiesThemeTours = catchAsync(async (req, res, next) => {
  const citiesTours = await getPublishedTours(
    { theme: "Cities" },
    SORTS.CITIES_THEME,
  );

  res.status(200).json({
    status: "success",
    data: {
      citiesTours,
    },
  });
});

// ==========================================
// CONTROLLER 6: Country Top Tours
// ==========================================
exports.getCountryTopTours = catchAsync(async (req, res, next) => {
  const targetCountries = ["Italy", "USA", "Australia", "Norway", "Iceland"];

  const countryPromises = targetCountries.map((country) =>
    Tour.find({
      status: "published",
      $or: [
        { "destinations.country": { $regex: new RegExp(`^${country}$`, "i") } },
        { country: { $regex: new RegExp(`^${country}$`, "i") } },
      ],
    })
      .sort({
        ratingsAverage: -1,
        ratingsQuantity: -1,
        createdAt: -1,
      })
      .limit(5)
      .lean(),
  );

  const results = await Promise.all(countryPromises);

  const data = targetCountries.reduce((acc, country, index) => {
    const displayKey = country.toUpperCase() === "USA" ? "USA" : country;
    acc[displayKey] = results[index];
    return acc;
  }, {});

  res.status(200).json({
    status: "success",
    data,
  });
});

exports.getTours = catchAsync(async (req, res, next) => {
  const {
    search,
    theme,
    country,
    minPrice,
    maxPrice,
    minDays,
    maxDays,
    minRating,
    minDiscount,
    featured,
    trending,
    sort = "Recommended",
    page = 1,
    limit = 6,
  } = req.query;

  const filter = {
    status: "published",
  };

  // ----------------------------
  // Search
  // ----------------------------

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { summary: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { theme: { $regex: search, $options: "i" } },
      { "destinations.country": { $regex: search, $options: "i" } },
      { "destinations.state": { $regex: search, $options: "i" } },
      { "destinations.city": { $regex: search, $options: "i" } },
    ];
  }

  // ----------------------------
  // Theme
  // ----------------------------

  if (theme) {
    filter.theme = {
      $in: theme.split(","),
    };
  }

  // ----------------------------
  // Country
  // ----------------------------

  if (country) {
    filter["destinations.country"] = {
      $in: country.split(","),
    };
  }

  // ----------------------------
  // Price
  // ----------------------------

  if (minPrice || maxPrice) {
    filter.startingPrice = {};

    if (minPrice) filter.startingPrice.$gte = Number(minPrice);

    if (maxPrice) filter.startingPrice.$lte = Number(maxPrice);
  }

  // ----------------------------
  // Duration
  // ----------------------------

  if (minDays || maxDays) {
    filter["duration.days"] = {};

    if (minDays) filter["duration.days"].$gte = Number(minDays);

    if (maxDays) filter["duration.days"].$lte = Number(maxDays);
  }

  // ----------------------------
  // Rating
  // ----------------------------

  if (minRating) {
    filter.ratingsAverage = {
      $gte: Number(minRating),
    };
  }

  // ----------------------------
  // Discount
  // ----------------------------

  if (minDiscount) {
    filter.discount = {
      $gte: Number(minDiscount),
    };
  }

  // ----------------------------

  if (featured === "true") filter.featured = true;

  if (trending === "true") filter.trending = true;

  // ----------------------------
  // Sorting
  // ----------------------------

  let sortBy = {
    featured: -1,
    trending: -1,
    ratingsAverage: -1,
  };

  switch (sort) {
    case "Highest Rated":
      sortBy = {
        ratingsAverage: -1,
        ratingsQuantity: -1,
      };
      break;

    case "Popularity":
      sortBy = {
        ratingsQuantity: -1,
      };
      break;

    case "Price Low → High":
      sortBy = {
        startingPrice: 1,
      };
      break;

    case "Price High → Low":
      sortBy = {
        startingPrice: -1,
      };
      break;

    case "Shortest Duration":
      sortBy = {
        "duration.days": 1,
      };
      break;

    case "Longest Duration":
      sortBy = {
        "duration.days": -1,
      };
      break;

    case "Newest":
      sortBy = {
        createdAt: -1,
      };
      break;
  }

  // ----------------------------
  // Pagination
  // ----------------------------

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const total = await Tour.countDocuments(filter);

  const tours = await Tour.find(filter)
    .sort(sortBy)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  res.status(200).json({
    status: "success",
    results: tours.length,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    data: {
      tours,
    },
  });
});
