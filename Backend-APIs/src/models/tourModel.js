const mongoose = require("mongoose");
const slugify = require("slugify");

// =======================================================
// SUB SCHEMAS
// =======================================================

const imageSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      required: [true, "Image public ID is required."],
      trim: true,
    },

    secureUrl: {
      type: String,
      required: [true, "Image secure URL is required."],
      trim: true,
    },

    alt: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const destinationSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const itinerarySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
      min: 1,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      country: String,
      state: String,
      city: String,
      lat: Number,
      lng: Number,
    },
  },
  {
    _id: false,
  },
);
// ==========================================
// PACKAGE SCHEMA
// ==========================================

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    website: {
      type: String,
      trim: true,
    },

    roomType: {
      type: String,
      default: "Standard",
      enum: ["Standard", "Deluxe", "Suite"],
    },
  },
  {
    _id: false,
  },
);

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["Normal", "Standard", "Premium"],
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    hotels: {
      type: [hotelSchema],
      default: [],
    },

    transportation: {
      type: String,
      required: true,
    },

    assistance: {
      type: String,
      required: true,
    },

    meals: {
      type: [String],
      default: [],
    },

    extraFacilities: {
      type: [String],
      default: [],
    },
  }
);

// =======================================================
// TOUR SCHEMA
// =======================================================

const tourSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    name: {
      type: String,
      required: [true, "Tour name is required."],
      trim: true,
      maxlength: 120,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    summary: {
      type: String,
      required: [true, "Tour summary is required."],
      trim: true,
      maxlength: 300,
    },

    description: {
      type: String,
      required: [true, "Tour description is required."],
      trim: true,
    },

    theme: {
      type: String,
      required: true,
      enum: [
        "Cities",
        "Mountains",
        "Oceans",
        "Forest",
        "Culture",
  
      ],
    },

    // ==========================================
    // DESTINATIONS
    // ==========================================

    destinations: {
      type: [destinationSchema],
      required: true,
      validate: {
        validator: (val) => Array.isArray(val) && val.length > 0,
        message: "At least one destination is required.",
      },
    },

    startLocation: {
      type: String,
      trim: true,
      default: "Flexible / Any Major City",
    },

    // ==========================================
    // DURATION
    // ==========================================

    duration: {
      days: {
        type: Number,
        required: true,
        min: 1,
      },

      nights: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    // ==========================================
    // PRICING
    // ==========================================

    startingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: function (val) {
          // `this` is only available on document creation (new Tour({...}))
          // On findOneAndUpdate, `this` is the Query object, not the document,
          // so startingPrice would be undefined. We skip the cross-field check
          // in that case — the controller already validates this before update.
          if (this && this.startingPrice !== undefined) {
            return val <= this.startingPrice;
          }
          return true;
        },
        message: "Discount price ({VALUE}) must not exceed starting price.",
      },
    },

    // Amount collected online to confirm booking (rest paid offline)
    advanceBookingAmount: {
      type: Number,
      required: [true, "Advance booking token amount is required."],
      min: [0, "Advance booking amount cannot be negative."],
      default: 2000,
    },

    // ==========================================
    // PACKAGES
    // ==========================================

    packages: {
      type: [packageSchema],
      default: [],
    },

    // ==========================================
    // MEDIA
    // ==========================================

    imageCover: {
      type: imageSchema,
    },

    images: {
      type: [imageSchema],
      default: [],
      validate: {
        validator: (v) => !v || v.length <= 5,
        message: "Maximum 5 gallery images allowed.",
      },
    },

    // ==========================================
    // ITINERARY
    // ==========================================

    itinerary: {
      type: [itinerarySchema],
      default: [],
    },

    // ==========================================
    // RATINGS
    // ==========================================

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above or equal to 1.0"],
      max: [5, "Rating must be below or equal to 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    // ==========================================
    // VISIBILITY & STATUS
    // ==========================================

    featured: {
      type: Boolean,
      default: false,
    },

    trending: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },

    // ==========================================
    // SEO
    // ==========================================

    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },

    // ==========================================
    // ADMIN
    // ==========================================

    createdBy: String,
    updatedBy: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// =======================================================
// VIRTUAL FIELDS
// =======================================================

// Final effective price after discount
tourSchema.virtual("effectivePrice").get(function () {
  return Math.max(0, this.startingPrice - (this.discount || 0));
});

// Remaining balance to be collected offline after online advance deposit
tourSchema.virtual("remainingOfflineAmount").get(function () {
  const finalPrice = Math.max(0, this.startingPrice - (this.discount || 0));
  return Math.max(0, finalPrice - (this.advanceBookingAmount || 0));
});

// =======================================================
// OPTIMIZED INDEXES (Covers 90%+ of Search & Filtering Queries)
// =======================================================

// // 1. Direct Slug Lookup (/tours/:slug)
// tourSchema.index({ slug: 1 });

// 2. Primary Compound Index (Theme Carousel, Trending Marquee, & Discounted Cards)
// Covers: { status, theme }, { status, trending }, { status, trending, discount }, { status, theme, trending, discount }
tourSchema.index({ status: 1, theme: 1, trending: 1, discount: -1 });

// 3. Destination Index (Top Countries, States, & City Carousels)
// Covers: { status, country }, { status, country, state }, { status, country, state, city }
tourSchema.index({
  status: 1,
  "destinations.country": 1,
  "destinations.state": 1,
  "destinations.city": 1,
  trending: 1,
});

// 4. Searchbar Range & Filter Index (Price Range, Duration Days, & Price Sorting)
tourSchema.index({ status: 1, startingPrice: 1, "duration.days": 1 });

// 5. Featured Tours Section
tourSchema.index({ status: 1, featured: 1 });

// 6. Full-Text Search Index (Global Searchbar matching Name, City, State, Country, Summary)
tourSchema.index(
  {
    name: "text",
    "destinations.city": "text",
    "destinations.state": "text",
    "destinations.country": "text",
    summary: "text",
    description: "text",
  },
  {
    weights: {
      name: 10,
      "destinations.city": 8,
      "destinations.state": 6,
      "destinations.country": 5,
      summary: 3,
      description: 1,
    },
    name: "tour_search_text_index",
  },
);

// =======================================================
// MIDDLEWARE
// =======================================================

tourSchema.pre("save", function (next) {
  if (this.isModified("name") && this.name) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }

  next();
});

module.exports = mongoose.model("Tour", tourSchema);
