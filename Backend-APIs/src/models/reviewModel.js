const mongoose = require("mongoose");
const Tour = require("./tourModel");
const Booking = require("./bookingModel");
const User = require("./userModel");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review text cannot be empty!"],
      trim: true,
      maxlength: [2000, "Review cannot exceed 2000 characters."],
    },

    title: {
      type: String,
      trim: true,
      maxlength: [120, "Review title cannot exceed 120 characters."],
      default: "",
    },

    rating: {
      type: Number,
      required: [true, "Rating is required."],
      min: [1, "Rating must be at least 1.0"],
      max: [5, "Rating cannot exceed 5.0"],
    },

    subRatings: {
      guide: { type: Number, min: 1, max: 5, default: 5 },
      hotel: { type: Number, min: 1, max: 5, default: 5 },
      transport: { type: Number, min: 1, max: 5, default: 5 },
      valueForMoney: { type: Number, min: 1, max: 5, default: 5 },
      itinerary: { type: Number, min: 1, max: 5, default: 5 },
    },

    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."],
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Review must be linked to a completed booking."],
    },

    verified: {
      type: Boolean,
      default: true,
    },

    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Ensure a user can only review a single booking once
reviewSchema.index({ booking: 1 }, { unique: true });
reviewSchema.index({ tour: 1, createdAt: -1 });

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId, isApproved: true },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: Math.round(stats[0].avgRating * 10) / 10,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.statics.calcDetailedStats = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: new mongoose.Types.ObjectId(tourId), isApproved: true },
    },
    {
      $group: {
        _id: "$tour",
        totalReviews: { $sum: 1 },
        avgRating: { $avg: "$rating" },
        avgGuide: { $avg: "$subRatings.guide" },
        avgHotel: { $avg: "$subRatings.hotel" },
        avgTransport: { $avg: "$subRatings.transport" },
        avgValue: { $avg: "$subRatings.valueForMoney" },
        avgItinerary: { $avg: "$subRatings.itinerary" },
        star5: { $sum: { $cond: [{ $gte: ["$rating", 4.5] }, 1, 0] } },
        star4: {
          $sum: {
            $cond: [
              { $and: [{ $gte: ["$rating", 3.5] }, { $lt: ["$rating", 4.5] }] },
              1,
              0,
            ],
          },
        },
        star3: {
          $sum: {
            $cond: [
              { $and: [{ $gte: ["$rating", 2.5] }, { $lt: ["$rating", 3.5] }] },
              1,
              0,
            ],
          },
        },
        star2: {
          $sum: {
            $cond: [
              { $and: [{ $gte: ["$rating", 1.5] }, { $lt: ["$rating", 2.5] }] },
              1,
              0,
            ],
          },
        },
        star1: { $sum: { $cond: [{ $lt: ["$rating", 1.5] }, 1, 0] } },
      },
    },
  ]);

  if (stats.length > 0) {
    const s = stats[0];
    return {
      totalReviews: s.totalReviews,
      avgRating: Math.round(s.avgRating * 10) / 10,
      distribution: {
        fiveStar: s.star5,
        fourStar: s.star4,
        threeStar: s.star3,
        twoStar: s.star2,
        oneStar: s.star1,
      },
      subRatingsAverage: {
        guide: Math.round(s.avgGuide * 10) / 10,
        hotel: Math.round(s.avgHotel * 10) / 10,
        transport: Math.round(s.avgTransport * 10) / 10,
        valueForMoney: Math.round(s.avgValue * 10) / 10,
        itinerary: Math.round(s.avgItinerary * 10) / 10,
      },
    };
  }

  return {
    totalReviews: 0,
    avgRating: 4.5,
    distribution: {
      fiveStar: 0,
      fourStar: 0,
      threeStar: 0,
      twoStar: 0,
      oneStar: 0,
    },
    subRatingsAverage: {
      guide: 5,
      hotel: 5,
      transport: 5,
      valueForMoney: 5,
      itinerary: 5,
    },
  };
};

reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.tour);
  }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
