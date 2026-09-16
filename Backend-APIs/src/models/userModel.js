const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const bookmarkTourSchema = new mongoose.Schema(
  {
    tour_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },

    bookmarkedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
);


const userSchema = new mongoose.Schema(
  {
    // Personal Information

    name: {
      type: String,
      required: [true, "User must have a name"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "User must have an email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },

    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (value) {
          return !value || validator.isMobilePhone(value, "any");
        },
        message: "Please provide a valid phone number",
      },
    },

    photo: {
      url: {
        type: String,
        default: "default-user.jpg",
      },

      publicId: {
        type: String,
        default: null,
      },
    },

    // Authentication

    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (value) {
          // Only works on CREATE and SAVE
          return value === this.password;
        },
        message: "Passwords do not match",
      },
    },

    passwordChangedAt: Date,

    passwordResetToken: String,

    passwordResetExpires: Date,

    // Authorization
    // ==========================
    role: {
      type: String,
      enum: ["user", "guide", "lead-guide", "admin"],
      default: "user",
    },

    // ==========================
    // Account Status
    // ==========================

    active: {
      type: Boolean,
      default: true,
      select: false,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      select: false,
    },
    otpExpires: {
      type: Date,
      select: false,
    },
    lastLogin: Date,

    // Profile

    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
      default: "prefer-not-to-say",
    },

    dateOfBirth: Date,

    bio: {
      type: String,
      trim: true,
      maxlength: [300, "Bio cannot exceed 300 characters"],
    },

    bookmarkedTours: {
      type: [bookmarkTourSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);


// pre middlewares..

// /signUp  //encrypted password storing..
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// password validation 
userSchema.methods.correctPassword = async function (candidatePassword, accountPassword)
{
  return await bcrypt.compare(candidatePassword, accountPassword);
}


// checking about does user has changed password so old token get invalid..
userSchema.methods.changedPasswordAfter = function(JWTTimeStamp)
{
  if (this.passwordChangedAt)
  {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    
    return JWTTimeStamp < changedTimeStamp;
  }

  return false;
}

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 Minutes...

  return resetToken;
}

userSchema.methods.createEmailVerificationOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  this.otp = crypto.createHash("sha256").update(otp).digest("hex");

  this.otpExpires = Date.now() + 10 * 60 * 1000;

  return otp;
};

userSchema.methods.verifyOTP = function (candidateOTP) {
  if (!this.otp || !this.otpExpires) return false;

  const hashedOTP = crypto
    .createHash("sha256")
    .update(candidateOTP)
    .digest("hex");

  return hashedOTP === this.otp && this.otpExpires > Date.now();
};

userSchema.methods.validateDuration = function () {
  return this.passwordResetExpires > Date.now();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
