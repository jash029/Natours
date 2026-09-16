const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    meetingMode: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },
    preferredTime: {
      type: String,
       required: true,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled", "resolved"],
      default: "pending",
    },

    message: {
      type: String,
    },

    internalNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Consultation = mongoose.model("Consultation", consultationSchema);

module.exports = Consultation;
