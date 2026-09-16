const Review = require("../models/reviewModel");
const Booking = require("../models/bookingModel");
const Tour = require("../models/tourModel");
const catchAsync = require("../utils/error");
const AppError = require("../utils/appError");

exports.createReview = catchAsync(async (req, res, next) => {
  const { bookingId, tourId, rating, subRatings, review, title } = req.body;

  if (!bookingId || (!tourId && !req.params.tourId)) {
    return next(new AppError("Please provide bookingId and tourId.", 400));
  }

  const resolvedTourId = tourId || req.params.tourId;

  // Verify booking belongs to user and is completed or expired
  const booking = await Booking.findOne({
    _id: bookingId,
    user: req.user.id,
  });

  if (!booking) {
    return next(
      new AppError("No booking found for this user with that ID.", 404),
    );
  }

  if (
    booking.bookingStatus !== "completed" &&
    booking.bookingStatus !== "expired"
  ) {
    return next(
      new AppError(
        "Reviews can only be written after your trip is completed or expired.",
        400,
      ),
    );
  }

  // Check if review already exists for this booking
  const existingReview = await Review.findOne({ booking: booking._id });
  if (existingReview) {
    return next(
      new AppError(
        "You have already submitted a review for this tour booking.",
        400,
      ),
    );
  }

  const newReview = await Review.create({
    tour: resolvedTourId,
    user: req.user.id,
    booking: booking._id,
    rating,
    subRatings: subRatings || {},
    review,
    title: title || "",
    verified: true,
  });

  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({
    user: req.user.id,
    isApproved: true,
  })
    .populate({
      path: "tour",
      select: "name imageCover summary",
    })
    .populate({
      path: "booking",
      select: "bookingNumber travelDate",
    })
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
});
