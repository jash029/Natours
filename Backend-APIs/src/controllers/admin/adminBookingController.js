const Booking = require("../../models/bookingModel");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/error");
const Email = require("../../utils/email");

exports.getAllBookings = catchAsync(async (req, res, next) => {
  const { search, bookingStatus, paymentStatus, verificationStatus } =
    req.query;

  const queryObj = {};

  if (bookingStatus) {
    queryObj.bookingStatus = bookingStatus;
  }

  if (paymentStatus) {
    queryObj["payment.status"] = paymentStatus;
  }

  if (verificationStatus) {
    queryObj.documentVerificationStatus = verificationStatus;
  }

  let filter = Booking.find(queryObj);

  if (search) {
    const searchRegex = new RegExp(search, "i");
    filter = filter.or([
      { bookingNumber: searchRegex },
      { packageName: searchRegex },
      { "travelers.firstName": searchRegex },
      { "travelers.lastName": searchRegex },
      { "travelers.phoneNumber": searchRegex },
    ]);
  }

  const bookings = await filter
    .populate({
      path: "tour",
      select: "name slug theme imageCover startingPrice duration",
    })
    .populate({
      path: "user",
      select: "name email phoneNumber",
    })
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: bookings.length,
    bookings,
  });
});

exports.getBookingDetails = catchAsync(async (req, res, next) => {
    const booking = await Booking.findById(req.params.bookingNumber)
    .populate({
      path: "tour",
      select:
        "name slug summary theme imageCover startingPrice duration startLocation destinations itinerary",
    })
    .populate({
      path: "user",
      select: "name email phoneNumber photo",
    });

  if (!booking) {
    return next(new AppError("Booking not found.", 404));
  }

  res.status(200).json({
    status: "success",
    booking,
  });
});

exports.verifyOrRejectDocuments = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate("user");

  if (!booking) {
    return next(new AppError("Booking not found.", 404));
  }

  // If already verified, admin can no longer modify document verification status
  if (
    booking.documentVerificationStatus === "verified" &&
    req.body.force !== true
  ) {
    return next(
      new AppError(
        "Document verification is already complete and verified. Documents are read-only.",
        400,
      ),
    );
  }

  const { decisions } = req.body;
  // decisions should be an array or object:
  // Array of { travelerIndex: 0, docType: 'passport', action: 'verify'|'reject', reason: '' }

  if (decisions && Array.isArray(decisions)) {
    decisions.forEach((dec) => {
      const { travelerIndex, docType, action, reason } = dec;
      if (
        booking.travelers[travelerIndex] &&
        booking.travelers[travelerIndex].travelDocuments &&
        booking.travelers[travelerIndex].travelDocuments[docType]
      ) {
        const docObj =
          booking.travelers[travelerIndex].travelDocuments[docType];
        if (docObj.file) {
          docObj.file.status = action === "reject" ? "rejected" : "verified";
          docObj.file.rejectionReason =
            action === "reject" ? reason || "Document invalid or unclear" : "";
        }
      }
    });
  }

  // Check overall document status across all travelers and their uploaded document files
  let hasRejections = false;
  let allVerified = true;
  const rejectedDocsList = [];

  booking.travelers.forEach((traveler, tIdx) => {
    const travelerName = `${traveler.firstName} ${traveler.lastName}`;
    const docs = traveler.travelDocuments || {};

    ["passport", "nationalId", "visa", "insurance"].forEach((docKey) => {
      const doc = docs[docKey];
      if (doc && doc.file && doc.file.secureUrl) {
        if (doc.file.status === "rejected") {
          hasRejections = true;
          allVerified = false;
          rejectedDocsList.push({
            travelerName,
            docType: docKey.toUpperCase(),
            reason:
              doc.file.rejectionReason ||
              "Document rejected by verification team",
          });
        } else if (doc.file.status !== "verified") {
          allVerified = false;
        }
      }
    });
  });

  if (hasRejections) {
    booking.documentVerificationStatus = "rejected";
    await booking.save();

    // Send rejection email to user
    try {
      await new Email(booking.user, "").sendDocumentRejection(
        booking,
        rejectedDocsList,
      );
    } catch (err) {
      console.error("Failed to send rejection email:", err.message);
    }

    return res.status(200).json({
      status: "success",
      verificationStatus: "rejected",
      message: "Some documents were rejected. Notification email sent to user.",
      booking,
    });
  }

  if (allVerified) {
    booking.documentVerificationStatus = "verified";
    // If pending, mark booking status as confirmed if advance or payment is good
    if (booking.bookingStatus === "pending") {
      booking.bookingStatus = "confirmed";
    }
    await booking.save();

    const contactPhone = req.body.contactPhone || "+91 91111 11111";

    // Send completion email
    try {
      await new Email(booking.user, "").sendDocumentVerificationComplete(
        booking,
        contactPhone,
      );
    } catch (err) {
      console.error("Failed to send verification complete email:", err.message);
    }

    return res.status(200).json({
      status: "success",
      verificationStatus: "verified",
      message:
        "bookingDocument verification complete please call " +
        contactPhone +
        " for offline payment and bookingtickets.",
      booking,
    });
  }

  booking.documentVerificationStatus = "pending";
  await booking.save();

  res.status(200).json({
    status: "success",
    verificationStatus: "pending",
    message: "Document verification saved.",
    booking,
  });
});

exports.markPaymentFullPaid = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id).populate("user");

  if (!booking) {
    return next(new AppError("Booking not found.", 404));
  }

  booking.payment.status = "fullPaid";
  booking.payment.paidAt = new Date();
  booking.amountPaid = booking.totalAmount;
  booking.remainingAmount = 0;

  if (booking.bookingStatus === "pending") {
    booking.bookingStatus = "confirmed";
  }

  await booking.save();

  // Send email confirmation
  try {
    await new Email(booking.user, "").sendPaymentConfirmation(booking);
  } catch (err) {
    console.error("Payment confirmation email error:", err.message);
  }

  res.status(200).json({
    status: "success",
    message: "Payment updated to FULL PAID successfully.",
    booking,
  });
});

exports.markJourneyCompleted = catchAsync(async (req, res, next) => {
  const { status } = req.body; // "completed" or "expired"
  const newStatus = status === "expired" ? "expired" : "completed";

  const booking = await Booking.findById(req.params.id).populate("user");

  if (!booking) {
    return next(new AppError("Booking not found.", 404));
  }

  booking.bookingStatus = newStatus;
  await booking.save();

  res.status(200).json({
    status: "success",
    message: `Booking journey marked as ${newStatus}. Client can now write a tour review.`,
    booking,
  });
});
