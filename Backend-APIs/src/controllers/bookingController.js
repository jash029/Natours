const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/error");
const AppError = require("../utils/appError");
const { uploadAllTravelerDocuments } = require("../services/bookingDocuments");
const Tour = require("../models/tourModel");
const Email = require("../utils/email");
exports.getMyAllBooking = catchAsync(async (req, res, next) => {
    const bookings = await Booking.find({user : req.user.id}).populate({
        path : 'tour',
        select : 'name imageCover slug duration'
    }).sort('-createdAt')
    res.status(200).json({
        status : 'success',
        data : {
            bookings
        }
    })  
})  


exports.getMyTourDetails = catchAsync(async (req, res, next) => {
  console.log("getMyTourDetails reached");
  console.log("Params:", req.params);
  console.log("Logged In User:", req.user.id);

  const booking = await Booking.findOne({
    _id : req.params.bookingNumber,
    user: req.user.id,
  }).populate({
    path: "tour",
    select:
      "name imageCover slug destinations summary theme startLocation duration itinerary",
  });

  if (!booking) {
    return next(
      new AppError(
        "Booking not found or you are not authorized to access it.",
        404,
      ),
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      booking,
    },
  });
});


exports.createMyBooking = catchAsync(async (req, res, next) => {
  const body = JSON.parse(req.body.bookingData);
const tour = await Tour.findOne({ slug: req.params.slug });

if (!tour) {
  return next(new AppError("No tour found with that slug.", 404));
}
  const bookingData = {
    bookingNumber : generateBookingNumber(),

    user: req.user._id,

    tour: tour._id,

    packageName: body.packageName,

    selectedHotel: {
      name: body.selectedHotel.name,
      rating: body.selectedHotel.rating,
      website: body.selectedHotel.website,
      roomType: body.selectedHotel.roomType,
    },

    travelDate: body.travelDate,

    travelers: body.travelers,

    emergencyContact: {
      name: body.emergencyContact.name,
      relation: body.emergencyContact.relation,
      phoneNumber: body.emergencyContact.phoneNumber,
    },

    pricePerPerson: body.pricePerPerson,

    totalAmount: body.totalAmount,

    amountPaid: body.amountPaid,

    remainingAmount: body.remainingAmount,

   termsAndPolicy: {
  terms: {
    refundPolicy: body.terms.refundPolicy,
    cancellationPolicy: body.terms.cancellationPolicy,
    failedPaymentPolicy: body.terms.failedPaymentPolicy,
    insurancePolicy: body.terms.insurancePolicy,
    documentVerificationPolicy:
      body.terms.documentVerificationPolicy,
    criminalAndImmigrationPolicy:
      body.terms.criminalAndImmigrationPolicy,
    travelerInformationPolicy:
      body.terms.travelerInformationPolicy,
    thirdPartyServicesPolicy:
      body.terms.thirdPartyServicesPolicy,
    healthDeclarationPolicy:
      body.terms.healthDeclarationPolicy,
    termsAndConditions:
      body.terms.termsAndConditions,
    acceptedAt: body.terms.acceptedAt,
    ipAddress: body.terms.ipAddress,
    acceptedVersion: body.terms.acceptedVersion,
  },
 },

    payment: {
      provider: body.payment.provider,
      status: body.payment.status,
        paidAt: body.payment.paidAt,
        orderId: generateOrderId(),
        paymentId: generatePaymentId(),
        error: null,
        
    },
    };
    
    bookingData.travelers = await uploadAllTravelerDocuments({
      travelers: bookingData.travelers,
      files: req.files,
      userId: req.user._id,
      bookingNumber: bookingData.bookingNumber,
    });

  const booking = await Booking.create(bookingData);
  
  const populatedBooking = await Booking.findById(booking._id)
    .populate({
      path: "tour",
      select: `
      name
      slug
      theme
      duration
      startLocation
      destinations
      imageCover
      summary
      difficulty
    `,
    })
    .populate({
      path: "user",
      select: "name email",
    });
  
  try {

    await new Email(populatedBooking.user, "").sendBookingEmail(populatedBooking);

    res.status(201).json({
      status: "success",
      data: {
        booking,
      },
    });
  }
  catch(err) {
    console.error("Error in sending booking mail :", err);

    res.status(200).json({
      status: "success",
      message: "Booking created successfully but Not able to send email",
      data: {
        booking,
      },
    });
  }
    
});

function generateBookingNumber() {
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");

  return `BK-${Date.now()}-${random}`;
};

const generatePaymentId = () =>
  `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const generateOrderId = () =>
  `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;