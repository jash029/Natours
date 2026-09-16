const express = require("express");
const {
  getTours,
  getTour,
  getTrendingAndDiscountTours,
  getThemeToursAndDiscounts,
  getTopTrendingTours,
  getNatureThemeTours,
  getCitiesThemeTours,
  getCountryTopTours,
} = require("../controllers/tourController");

const {
  getTourReviews,
  getTourStats,
} = require("../controllers/reviewController");

const router = express.Router();

// Homepage Specialized Retrieval Routes
router.get("/trending-and-discounts", getTrendingAndDiscountTours);
router.get("/theme-and-discounts", getThemeToursAndDiscounts);
router.get("/top-trending", getTopTrendingTours);
router.get("/nature-themes", getNatureThemeTours);
router.get("/cities-theme", getCitiesThemeTours);
router.get("/getCountryTopTours", getCountryTopTours);








router
  .route("/")
  .get(getTours);

router
  .route("/:slug")
  .get(getTour);

module.exports = router;

