const mongoose = require("mongoose");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/error");
const User = require("../models/userModel");
const Tour = require("../models/tourModel");

const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/uploadCloud");

const Consultation = require("../models/cosultantModel");
const Assistance = require("../models/assistanceModel");
const Email = require("../utils/email");
const Booking = require("../models/bookingModel");
exports.getMe = function (req, res) {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  const updates = {};

  // Name (editable anytime)
  if (req.body.name) {
    updates.name = req.body.name.trim();
  }

  // Bio (editable anytime)
  if (req.body.bio !== undefined) {
    updates.bio = req.body.bio;
  }

  // Date of Birth (only once)
  if (req.body.dateOfBirth) {
    if (user.dateOfBirth) {
      return next(new AppError("Date of birth can only be updated once.", 400));
    }

    updates.dateOfBirth = req.body.dateOfBirth;
  }

  // Gender (only once)
  if (req.body.gender) {
    if (user.gender !== "prefer-not-to-say") {
      return next(new AppError("Gender can only be updated once.", 400));
    }

    updates.gender = req.body.gender;
  }

  // photo...

  if (req.file) {
    // Delete previous image (if there is one)
    if (user.photo?.publicId) {
      await deleteFromCloudinary(user.photo.publicId);
    }

    const result = await uploadToCloudinary(req.file.buffer);

    updates.photo = {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }
  const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.consultantQuery = catchAsync(async (req, res, next) => {
  const { name, email, date, mode, time, message } = req.body;

  if (!name || !email || !date || !mode || !time) {
    return next(new AppError("Please provide all required fields.", 400));
  }

  const obj = {
    fullName: name,
    email,
    date,
    meetingMode: mode,
    preferredTime: time,
  };

  if (message) {
    obj.message = message;
  }
  const consultation = await Consultation.create(obj);

  try {
    await new Email(consultation).sendConsultant(mode, date, time);

    res.status(201).json({
      status: "success",
      message:
        "Your consultation has been booked successfully. Please check your email for the meeting details.",
    });
  } catch (err) {
    console.log(err.message);
    return next(
      new AppError(
        "Consultation booked, but we couldn't send the confirmation email. Please contact support.",
        500,
      ),
    );
  }
});

exports.getBookmarks = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: "bookmarkedTours.tour_id",
    select:
      "name slug summary imageCover startingPrice discount ratingsAverage ratingsQuantity   destinations theme duration",
  });

  res.status(200).json({
    status: "success",
    results: user.bookmarkedTours.length,
    data: {
      bookmarks: user.bookmarkedTours,
    },
  });
});

exports.addBookmarkTour = catchAsync(async (req, res, next) => {
  const identifier = req.params.slug || req.body.slug;

  if (!identifier) {
    return next(new AppError("Please provide a tour slug or ID.", 400));
  }

  // Accept either a slug or a tour ObjectId so this endpoint behaves
  // consistently with GET /tours/:slug, which resolves both.
  const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
  const query = isObjectId
    ? { $or: [{ _id: identifier }, { slug: identifier }] }
    : { slug: identifier };

  const tour = await Tour.findOne(query);

  if (!tour) {
    return next(new AppError("No tour found with that identifier.", 404));
  }

  const alreadyBookmarked = await User.exists({
    _id: req.user.id,
    "bookmarkedTours.tour_id": tour._id,
  });

  if (alreadyBookmarked) {
    return res.status(200).json({
      status: "success",
      bookmarked: true,
      message: "Tour is already bookmarked.",
    });
  }

  await User.findByIdAndUpdate(req.user.id, {
    $push: {
      bookmarkedTours: {
        tour_id: tour._id,
      },
    },
  });

  res.status(201).json({
    status: "success",
    bookmarked: true,
    message: "Tour bookmarked successfully.",
  });
});

exports.removeBookmarkTour = catchAsync(async (req, res, next) => {
  const identifier = req.params.slug || req.body.slug;

  if (!identifier) {
    return next(new AppError("Please provide a tour slug or ID.", 400));
  }

  const isObjectId = mongoose.Types.ObjectId.isValid(identifier);

  const tour = await Tour.findOne(
    isObjectId
      ? { $or: [{ _id: identifier }, { slug: identifier }] }
      : { slug: identifier },
  );

  if (!tour) {
    return next(new AppError("No tour found with that identifier.", 404));
  }

  const result = await User.updateOne(
    {
      _id: req.user.id,
      "bookmarkedTours.tour_id": tour._id,
    },
    {
      $pull: {
        bookmarkedTours: {
          tour_id: tour._id,
        },
      },
    },
  );

  if (result.modifiedCount === 0) {
    return next(new AppError("Tour is not bookmarked.", 404));
  }

  res.status(200).json({
    status: "success",
    bookmarked: false,
    message: "Bookmark removed successfully.",
  });
});

exports.bookingQuery = catchAsync(async (req, res, next) => {
  const { bookingId, subject, message, email : userEmail, category } = req.body;

  console.log(bookingId , 'bookingID');
  const user = await User.findOne({ email: userEmail });

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  const booking = await Booking.findOne({ _id: bookingId, user: user._id });

  if (!booking) {
    return next(new AppError("Booking not found.", 404));
  }

  const assistance = await Assistance.create({
    booking: booking._id,
    user: user._id,
    category,
    subject,
    message,
  }).populate({
    path: "user",
    select: "name email",
  });

  try{
    await new Email(user,'').sendBookingQuery(assistance);
    res.status(201).json({
      status: "success",
      message: "Booking query sent successfully.",
    });
  }catch(err){
    console.log(err.message);
    res.status(201).json({
      status: "error",
      message: "Booking Query Register SuccessFully but unable to send Email ",
    });
  }

  
})

exports.getMyBookingQueries = catchAsync(async (req, res, next) => {
  const queries = await Assistance.find({
    user: req.user.id,
  })
    .populate({
      path: "booking",
      select: "bookingNumber bookingStatus paymentStatus travelDate totalPrice",
    }).populate({
      path: "user",
      select: "name email"
    })
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: queries.length,
    data: {
      queries,
    },
  });
});

exports.getMyBookingQuery = catchAsync(async (req, res, next) => {
  const query = await Assistance.findOne({
    _id: req.params.id,
    user: req.user.id,
  }).populate({
    path: "booking",
    populate: {
      path: "tour",
      select: "name slug imageCover duration",
    },
  });

  if (!query) {
    return next(new AppError("Support request not found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      query,
    },
  });
});