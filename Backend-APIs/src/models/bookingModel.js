const mongoose = require("mongoose");

// =======================================================
// DOCUMENT FILE SCHEMA
// =======================================================

const documentFileSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      trim: true,
    },

    secureUrl: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

// =======================================================
// TRAVELER SCHEMA
// =======================================================
const emergencyContactSchema = new mongoose.Schema({
  // ==========================================
  // EMERGENCY CONTACT
  // ==========================================
  
    name: {
      type: String,
      required: true,
      trim: true,
    },

    relation: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { 
    _id : false
  }
);
const travelerSchema = new mongoose.Schema(
  {
    // ==========================================
    // PERSONAL INFORMATION
    // ==========================================

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    ageAtBooking: {
      type: Number,
      required: true,
      min: 0,
    },

    nationality: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // CONTACT INFORMATION
    // ==========================================

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

  

    

    // ==========================================
    // TRAVEL DOCUMENTS
    // ==========================================

    travelDocuments: {
      passport: {
        number: String,
        expiry: Date,
        file: documentFileSchema,
      },

      nationalId: {
        type: {
          type: String,
        },

        number: String,

        file: documentFileSchema,
      },

      visa: {
        number: String,
        expiry: Date,
        file: documentFileSchema,
      },

      insurance: {
        provider: String,

        policyNumber: String,

        file: documentFileSchema,
      },
    },
  },
  {
    _id: false,
  },
);

const termsSchema = mongoose.Schema({
  terms: {
    refundPolicy: {
      type: Boolean,
      required: true,
      default: false,
    },

    cancellationPolicy: {
      type: Boolean,
      required: true,
      default: false,
    },

    failedPaymentPolicy: {
      type: Boolean,
      required: true,
      default: false,
    },

    insurancePolicy: {
      type: Boolean,
      required: true,
      default: false,
    },

    documentVerificationPolicy: {
      type: Boolean,
      required: true,
      default: false,
    },

    criminalAndImmigrationPolicy: {
      type: Boolean,
      required: true,
      default: false,
    },

    travelerInformationPolicy: {
      type: Boolean,
      required: true,
      default: false,
    },

    thirdPartyServicesPolicy: {
      type: Boolean,
      required: true,
      default: false,
    },

    healthDeclarationPolicy: {
      type: Boolean,
      required: true,
      default: false,
    },

    termsAndConditions: {
      type: Boolean,
      required: true,
      default: false,
    },

    acceptedAt: Date,

    ipAddress: String,

    acceptedVersion: {
      type: String,
      default: "v1.0",
    },
  },
});
// =======================================================
// BOOKING SCHEMA
// =======================================================

const bookingSchema = new mongoose.Schema(
  {
    // ==========================================
    // REFERENCES
    // ==========================================

    bookingNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },

    packageName: {
      type: String,
      required: true,
    },

    selectedHotel: {
      name: {
        type: String,
        required: true,
      },

      rating: {
        type: Number,
        required: true,
      },

      website: String,

      roomType: {
        type: String,
        enum: ["Standard", "Deluxe", "Suite"],
      },
    },

    // ==========================================
    // TRAVEL INFORMATION
    // ==========================================

    travelDate: {
      type: Date,
      required: true,
    },

    travelers: {
      type: [travelerSchema],
      validate: {
        validator: (travelers) => travelers.length > 0,
        message: "At least one traveler is required.",
      },
    },

    emergencyContact: {
      type: emergencyContactSchema,
      required: true
    },

    // ==========================================
    // PRICING
    // ==========================================

    pricePerPerson: {
      type: Number,
      required: true,
      min: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    amountPaid: {
      type: Number,
      required: true,
      min: 0,
    },
    remainingAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    termsAndPolicy: {
      type: termsSchema,
      required: true,
    },
    // ==========================================
    // PAYMENT
    // ==========================================

    payment: {
      provider: {
        type: String,
        enum: ["card" , "upi"],
        default: "card",
      },

      orderId: String,

      paymentId: String,

      error: {
        type: String,
        trim: true,
      },

      status: {
        type: String,
        enum: ["pending", "advancePaid", "fullPaid", "failed", "refunded"],
        default: "pending",
      },

      paidAt: Date,
    },

    // ==========================================
    // BOOKING STATUS
    // ==========================================

    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "expired" , "failed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

// =======================================================
// INDEXES
// =======================================================

bookingSchema.index({ bookingNumber: 1 }, { unique: true });
bookingSchema.index({ user: 1 });
bookingSchema.index({ tour: 1 });
bookingSchema.index({ bookingStatus: 1 });
bookingSchema.index({ travelDate: 1 });

// =======================================================

module.exports = mongoose.model("Booking", bookingSchema);
