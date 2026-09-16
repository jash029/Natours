const mongoose = require('mongoose');

const assistanceSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      enum: [
        "Booking Issue",
        "Payment Issue",
        "Cancellation & Refund",
        "Reschedule Trip",
        "Travel Documents",
        "Hotel Issue",
        "Transportation",
        "Tour Guide",
        "Special Assistance",
        "Technical Problem",
        "Other",
      ],
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    message: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    contactPreference: {
      type: String,
      enum: ["email", "phone"],
      default: "email",
    },

    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    responses: [
      {
        sender: {
          type: String,
          enum: ["customer", "support"],
        },
        message: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);


const Assistance = mongoose.model('Assistance', assistanceSchema);

module.exports = Assistance;