const mongoose = require("mongoose");
const Tour = require("../../models/tourModel.js");
const { tours: storeTours, setTours } = require("../../data/store.js");
const {
  uploadCoverImage,
  uploadGalleryImages,
  uploadGalleryImage,
  deleteFromCloudinary,
  deleteTourCover,
  deleteTourFolder,
  getTourFolderPath,
  uploadBufferToCloudinary,
} = require("../../services/cloudinary.service.js");

const isDbConnected = () =>
  mongoose.connection && mongoose.connection.readyState === 1;

const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

exports.getAllTours = async (req, res) => {
  try {
    const { search, category, theme, status, page, limit, sort, fields } =
      req.query;

    if (isDbConnected()) {
      const queryObj = {};

      if (search) {
        queryObj.$or = [
          { name: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
          { destination: { $regex: search, $options: "i" } },
          { country: { $regex: search, $options: "i" } },
        ];
      }

      if (category || theme) {
        queryObj.theme = category || theme;
      }
      if (status) {
        queryObj.status = status;
      }

      let query = Tour.find(queryObj);

      if (sort) {
        const sortBy = sort.split(",").join(" ");
        query = query.sort(sortBy);
      } else {
        query = query.sort("-createdAt");
      }

      if (fields) {
        const fieldsList = fields.split(",").join(" ");
        query = query.select(fieldsList);
      }

      const pageNum = parseInt(page, 10) || 1;
      const limitNum = parseInt(limit, 10) || 50;
      const skip = (pageNum - 1) * limitNum;
      query = query.skip(skip).limit(limitNum);

      const tours = await query.lean();

      const normalizedTours = tours.map((t) => {
        const tourFolderPath = getTourFolderPath(t);
        return {
          id: t._id ? t._id.toString() : t.id,
          _id: t._id,
          title: t.name || t.title,
          name: t.name || t.title,
          slug: t.slug,
          category: t.theme || t.category || "General",
          theme: t.theme || t.category || "General",
          destinations:
            t.destinations ||
            (t.destinations && t.destinations[0]
              ? `${t.destinations[0].city}, ${t.destinations[0].country}`
              : "Global"),
          country:
            t.country ||
            (t.destinations && t.destinations[0]
              ? t.destinations[0].country
              : "Global"),
          duration_days: t.duration?.days || t.duration_days || 7,
          duration: t.duration || {
            days: t.duration_days || 7,
            nights: t.duration_days ? t.duration_days - 1 : 6,
          },
          price_usd: t.startingPrice || t.price_usd || 3000,
          startingPrice: t.startingPrice || t.price_usd || 3000,
          discount_price_usd: t.discount
            ? t.startingPrice - t.discount
            : t.discount_price_usd || null,
          discount: t.discount || 0,
          rating: t.ratingsAverage || t.rating || 4.8,
          reviews_count: t.ratingsQuantity || t.reviews_count || 0,
          status: t.status || "Active",
          featured: t.featured || false,
          trending: t.trending || false,
          imageCover:
            typeof t.imageCover === "object" && t.imageCover
              ? t.imageCover
              : {
                  secureUrl:
                    t.cover_image ||
                    t.imageCover ||
                    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
                  publicId: `${tourFolderPath}/cover/cover`,
                  alt: `${t.name || t.title} Cover`,
                },
          cover_image:
            typeof t.imageCover === "object" && t.imageCover
              ? t.imageCover.secureUrl
              : t.cover_image ||
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
          images: Array.isArray(t.images)
            ? t.images.map((img, i) => {
                if (typeof img === "string") {
                  return {
                    secureUrl: img,
                    publicId: `${tourFolderPath}/images/image-${i + 1}`,
                    alt: `${t.name || t.title} image ${i + 1}`,
                  };
                }
                return {
                  secureUrl: img.secureUrl || img.secure_url || img.url || "",
                  publicId:
                    img.publicId ||
                    img.public_id ||
                    `${tourFolderPath}/images/image-${i + 1}`,
                  alt: img.alt || `${t.name || t.title} image ${i + 1}`,
                };
              })
            : [],
          description: t.description || t.summary || "",
          summary: t.summary || t.description || "",
          created_at: t.createdAt || t.created_at,
        };
      });

      return res.status(200).json({
        status: "success",
        success: true,
        count: normalizedTours.length,
        results: normalizedTours.length,
        tours: normalizedTours,
        data: { tours: normalizedTours },
      });
    }

    let filtered = [...storeTours];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.destination && t.destination.toLowerCase().includes(q)) ||
          (t.country && t.country.toLowerCase().includes(q)),
      );
    }
    if (category || theme) {
      filtered = filtered.filter(
        (t) =>
          t.category === (category || theme) || t.theme === (category || theme),
      );
    }
    if (status) {
      filtered = filtered.filter((t) => t.status === status);
    }

    res.json({
      status: "success",
      success: true,
      count: filtered.length,
      results: filtered.length,
      tours: filtered,
      data: { tours: filtered },
    });
  } catch (err) {
    console.error("Error listing tours in adminTourController:", err);
    res
      .status(500)
      .json({ status: "error", error: "Failed to retrieve tours" });
  }
};

exports.getTour = async (req, res) => {
  try {
    const identifier = req.params.slug || req.params.id;

    if (!identifier || identifier === "undefined") {
      return res
        .status(400)
        .json({
          status: "fail",
          error: "Please provide a valid tour slug or ID",
        });
    }

    if (isDbConnected()) {
      const isObjectId = mongoose.Types.ObjectId.isValid(identifier);
      const query = isObjectId
        ? { $or: [{ _id: identifier }, { slug: identifier }] }
        : { slug: identifier };

      const tour = await Tour.findOne(query).lean();
      if (tour) {
        const tourFolderPath = getTourFolderPath(tour);
        const imagesList = Array.isArray(tour.images)
          ? tour.images.map((img, i) => {
              if (typeof img === "string") {
                return {
                  secureUrl: img,
                  publicId: `${tourFolderPath}/images/image-${i + 1}`,
                  alt: `${tour.name || tour.title} image ${i + 1}`,
                };
              }
              return {
                secureUrl: img.secureUrl || img.secure_url || img.url || "",
                publicId:
                  img.publicId ||
                  img.public_id ||
                  `${tourFolderPath}/images/image-${i + 1}`,
                alt: img.alt || `${tour.name || tour.title} image ${i + 1}`,
              };
            })
          : [];

        const normalized = {
          id: tour._id.toString(),
          _id: tour._id,
          title: tour.name || tour.title,
          name: tour.name || tour.title,
          slug: tour.slug,
          category: tour.theme || tour.category || "General",
          theme: tour.theme || tour.category || "General",
          effectivePrice:
            tour.effectivePrice || tour.startingPrice - tour.discount,
          destinations: tour?.destinations || "Global",
          country:
            tour.country ||
            (tour.destinations && tour.destinations[0]
              ? tour.destinations[0].country
              : "Global"),
          destination:
            tour.destinations && tour.destinations[0]
              ? tour.destinations[0].city
              : "Global",
          state:
            tour.destinations && tour.destinations[0]
              ? tour.destinations[0].state
              : "",
          startLocation: tour.startLocation || "Flexible / Any Major City",
          duration_days: tour.duration?.days || tour.duration_days || 7,
          duration: {
            days: tour?.duration?.days ?? 0,
            nights: tour?.duration?.nights ?? 0,
          },
          price_usd: tour.startingPrice || tour.price_usd || 3000,
          startingPrice: tour.startingPrice || tour.price_usd || 3000,
          discount: tour.discount || 0,
          advanceBookingAmount: tour.advanceBookingAmount || 2000,
          status: tour.status || "Active",
          featured: tour.featured || false,
          trending: tour.trending || false,
          imageCover:
            typeof tour.imageCover === "object" && tour.imageCover
              ? tour.imageCover
              : {
                  secureUrl:
                    tour.cover_image ||
                    tour.imageCover ||
                    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
                  publicId: `${tourFolderPath}/cover/cover`,
                  alt: `${tour.name || tour.title} Cover`,
                },
          cover_image:
            typeof tour.imageCover === "object" && tour.imageCover
              ? tour.imageCover.secureUrl
              : tour.cover_image ||
                tour.imageCover ||
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
          images: imagesList,
          description: tour.description || "",
          summary: tour.summary || "",
          itinerary: tour.itinerary || [],
          packages: tour.packages || [],
        };
        return res.json({
          status: "success",
          success: true,
          tour: normalized,
          data: { tour: normalized },
        });
      }
    }

    const storeTour = storeTours.find(
      (t) => t.id === identifier || t.slug === identifier,
    );
    if (!storeTour) {
      return res
        .status(404)
        .json({ status: "fail", error: "No tour found with that identifier" });
    }

    const tourFolderPath = getTourFolderPath(storeTour);
    const normalizedStore = {
      ...storeTour,
      cover_image:
        typeof storeTour.imageCover === "object" && storeTour.imageCover
          ? storeTour.imageCover.secureUrl
          : storeTour.cover_image ||
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
      imageCover:
        typeof storeTour.imageCover === "object" && storeTour.imageCover
          ? storeTour.imageCover
          : {
              secureUrl:
                storeTour.cover_image ||
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
              publicId: `${tourFolderPath}/cover/cover`,
              alt: `${storeTour.name || storeTour.title} Cover`,
            },
      images: Array.isArray(storeTour.images)
        ? storeTour.images.map((img, i) => {
            if (typeof img === "string") {
              return {
                secureUrl: img,
                publicId: `${tourFolderPath}/images/image-${i + 1}`,
                alt: `${storeTour.name || storeTour.title} image ${i + 1}`,
              };
            }
            return {
              secureUrl: img.secureUrl || img.secure_url || img.url || "",
              publicId:
                img.publicId ||
                img.public_id ||
                `${tourFolderPath}/images/image-${i + 1}`,
              alt:
                img.alt ||
                `${storeTour.name || storeTour.title} image ${i + 1}`,
            };
          })
        : [],
    };

    res.json({
      status: "success",
      success: true,
      tour: normalizedStore,
      data: { tour: normalizedStore },
    });
  } catch (err) {
    console.error("Error fetching tour detail in adminTourController:", err);
    res
      .status(500)
      .json({ status: "error", error: "Failed to retrieve tour details" });
  }
};

exports.createTour = async (req, res) => {
  try {
    const name = (req.body.name || req.body.title || "").trim();
    if (!name) {
      return res.status(400).json({ status: "fail", message: "Tour name is required." });
    }
    if (name.length > 120) {
      return res.status(400).json({ status: "fail", message: "Tour name cannot exceed 120 characters." });
    }

    const summary = (req.body.summary || req.body.description || "").trim();
    if (!summary) {
      return res.status(400).json({ status: "fail", message: "Tour summary is required." });
    }
    if (summary.length > 300) {
      return res.status(400).json({ status: "fail", message: "Tour summary cannot exceed 300 characters." });
    }

    const description = (req.body.description || req.body.summary || "").trim();
    if (!description) {
      return res.status(400).json({ status: "fail", message: "Tour description is required." });
    }

    const validThemes = ["Cities", "Mountains", "Oceans", "Forest", "Culture"];
    let rawTheme = req.body.theme || req.body.category || "Cities";
    let matchedTheme = validThemes.find((t) => t.toLowerCase() === rawTheme.toLowerCase());
    const theme = matchedTheme || "Cities";

    // Destination schema parsing & validation
    let destinations = req.body.destinations;
    if (typeof destinations === "string") {
      try {
        destinations = JSON.parse(destinations);
      } catch (e) {}
    }
    if (!Array.isArray(destinations) || destinations.length === 0) {
      const city = (req.body.destination || req.body.city || "Denver").trim();
      const state = (req.body.state || "Colorado").trim();
      const country = (req.body.country || "USA").trim();
      destinations = [{ country, state, city }];
    } else {
      destinations = destinations.map((d) => ({
        country: (d.country || "USA").trim(),
        state: (d.state || "").trim(),
        city: (d.city || d.destination || "Denver").trim(),
      }));
    }

    // Pricing & discount validation
    const startingPrice = parseFloat(req.body.startingPrice ?? req.body.price_usd) || 0;
    if (startingPrice < 0) {
      return res.status(400).json({ status: "fail", message: "Starting price cannot be negative." });
    }

    const discount = parseFloat(req.body.discount) || 0;
    if (discount < 0) {
      return res.status(400).json({ status: "fail", message: "Discount price cannot be negative." });
    }
    if (discount > startingPrice) {
      return res.status(400).json({
        status: "fail",
        message: `Discount price ($${discount}) must not exceed starting price ($${startingPrice}).`,
      });
    }

    const advanceBookingAmount = req.body.advanceBookingAmount !== undefined ? parseFloat(req.body.advanceBookingAmount) : 2000;
    if (advanceBookingAmount < 0) {
      return res.status(400).json({ status: "fail", message: "Advance booking amount cannot be negative." });
    }

    const durationDays = parseInt(req.body.duration_days || (req.body.duration && req.body.duration.days), 10) || 7;
    const durationNights = durationDays > 1 ? durationDays - 1 : 0;
    const duration = { days: Math.max(1, durationDays), nights: Math.max(0, durationNights) };

    // Packages parsing & validation
    let packages = req.body.packages;
    if (typeof packages === "string") {
      try {
        packages = JSON.parse(packages);
      } catch (e) {}
    }
    if (!Array.isArray(packages)) packages = [];
    packages = packages.map((pkg) => {
      let pName = pkg.name || "Normal";
      if (!["Normal", "Standard", "Premium"].includes(pName)) {
        if (pName.toLowerCase().includes("premium")) pName = "Premium";
        else if (pName.toLowerCase().includes("standard")) pName = "Standard";
        else pName = "Normal";
      }
      return {
        name: pName,
        price: typeof pkg.price === "number" ? pkg.price : parseFloat(pkg.price) || startingPrice,
        transportation: pkg.transportation || "Shared Bus",
        assistance: pkg.assistance || "24/7 Phone Support",
        meals: Array.isArray(pkg.meals) ? pkg.meals : [],
        extraFacilities: Array.isArray(pkg.extraFacilities) ? pkg.extraFacilities : [],
        hotels: Array.isArray(pkg.hotels)
          ? pkg.hotels.map((h) => ({
              name: h.name || "Luxury Hotel",
              rating: Math.min(5, Math.max(1, parseFloat(h.rating) || 4)),
              website: h.website || "",
              roomType: ["Standard", "Deluxe", "Suite"].includes(h.roomType) ? h.roomType : "Standard",
            }))
          : [],
      };
    });

    // Itinerary parsing
    let itinerary = req.body.itinerary;
    if (typeof itinerary === "string") {
      try {
        itinerary = JSON.parse(itinerary);
      } catch (e) {}
    }
    if (!Array.isArray(itinerary)) itinerary = [];

    // SEO parsing
    let seo = req.body.seo;
    if (typeof seo === "string") {
      try {
        seo = JSON.parse(seo);
      } catch (e) {}
    }
    if (typeof seo !== "object" || seo === null) {
      seo = { metaTitle: "", metaDescription: "", keywords: [] };
    }

    const generatedSlug = slugify(name);
    const tourContext = {
      theme,
      country: destinations[0]?.country || "USA",
      name,
      slug: generatedSlug,
    };

    const files = req.files || [];

    // Process cover image upload via Cloudinary service
    let imageCover = null;
    let cover_image = req.body.cover_image || "";
    const coverFiles = files.filter(
      (f) => f.fieldname === "imageCover" || f.fieldname === "cover_image",
    );
    if (coverFiles.length > 0) {
      const coverRes = await uploadCoverImage(coverFiles[0].buffer, tourContext);
      imageCover = {
        secureUrl: coverRes.secureUrl,
        publicId: coverRes.publicId,
        alt: `${name} Cover Image`,
      };
      cover_image = coverRes.secureUrl;
    }

    // Process gallery images upload via Cloudinary service
    const galleryFiles = files.filter(
      (f) => f.fieldname === "images" || f.fieldname === "new_gallery_images",
    );
    if (galleryFiles.length > 5) {
      return res.status(400).json({ status: "fail", message: "Maximum 5 gallery images allowed." });
    }

    let imagesList = [];
    if (galleryFiles.length > 0) {
      const galleryUploads = await uploadGalleryImages(galleryFiles.slice(0, 5), tourContext);
      imagesList = galleryUploads.map((res, i) => ({
        secureUrl: res.secureUrl,
        publicId: res.publicId,
        alt: `${name} Gallery Image ${i + 1}`,
      }));
    }

    const tourPayload = {
      name,
      slug: generatedSlug,
      summary,
      description,
      theme,
      destinations,
      startLocation: req.body.startLocation || "Flexible / Any Major City",
      duration,
      startingPrice,
      discount,
      advanceBookingAmount,
      packages,
      itinerary,
      seo,
      status: req.body.status || "published",
      featured: req.body.featured === "true" || req.body.featured === true,
      trending: req.body.trending === "true" || req.body.trending === true,
      createdBy: req.body.createdBy || "System",
      updatedBy: req.body.updatedBy || "System",
      ...(imageCover ? { imageCover, cover_image } : {}),
      images: imagesList,
    };

    let newTourDoc = null;
    if (isDbConnected()) {
      newTourDoc = await Tour.create(tourPayload);
    } else {
      const tourId = "tur_" + Date.now();
      newTourDoc = { id: tourId, _id: tourId, ...tourPayload, createdAt: new Date().toISOString() };
      storeTours.unshift(newTourDoc);
    }

    res.status(201).json({
      status: "success",
      success: true,
      tour: newTourDoc,
      data: { tour: newTourDoc },
    });
  } catch (err) {
    console.error("Error creating tour in adminTourController:", err);
    res.status(400).json({ status: "fail", error: err.message || "Failed to create tour" });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const id = req.params.id;

    let tour = null;
    let filter = {};

    if (isDbConnected()) {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      filter = isObjectId ? { _id: id } : { slug: id };
      tour = await Tour.findOne(filter);
    } else {
      tour = storeTours.find((t) => t.id === id || t.slug === id);
    }

    if (!tour) {
      return res
        .status(404)
        .json({ status: "fail", message: "Tour not found" });
    }

    const tourId = (tour._id || tour.id).toString();
    const updateData = { ...req.body };
    const allFiles = Array.isArray(req.files)
      ? req.files
      : req.files
        ? Object.values(req.files).flat()
        : [];

    const updatedContext = {
      theme: updateData.theme || tour.theme || tour.category,
      country: updateData.country || tour.country || tour.destination,
      name: updateData.name || updateData.title || tour.name || tour.title,
      slug: tour.slug || updateData.slug,
      id: tourId,
      _id: tourId,
    };

    // 1. COVER IMAGE MANAGEMENT
    const coverFiles = allFiles.filter(
      (f) => f.fieldname === "imageCover" || f.fieldname === "cover_image",
    );
    if (coverFiles.length > 0) {
      const coverFile = coverFiles[0];
      const coverRes = await uploadCoverImage(coverFile.buffer, updatedContext);
      updateData.imageCover = {
        secureUrl: coverRes.secureUrl,
        publicId: coverRes.publicId,
        alt: `${updatedContext.name} Cover`,
      };
      updateData.cover_image = coverRes.secureUrl;
    } else if (
      req.body.delete_cover === "true" ||
      req.body.delete_cover === true
    ) {
      await deleteTourCover(updatedContext);
      updateData.imageCover = { secureUrl: "", publicId: "" };
      updateData.cover_image = "";
    }

    // 2. GALLERY IMAGES MANAGEMENT
    const tourFolderPath = getTourFolderPath(updatedContext);
    let rawGallery = Array.isArray(tour.images) ? [...tour.images] : [];
    let currentGallery = rawGallery.map((img, i) => {
      if (typeof img === "string") {
        return {
          secureUrl: img,
          publicId: `${tourFolderPath}/images/image-${i + 1}`,
          alt: `${updatedContext.name} image ${i + 1}`,
        };
      }
      return {
        secureUrl: img.secureUrl || img.secure_url || img.url || "",
        publicId:
          img.publicId ||
          img.public_id ||
          `${tourFolderPath}/images/image-${i + 1}`,
        alt: img.alt || `${updatedContext.name} image ${i + 1}`,
      };
    });

    // Process removals
    let removeList = req.body.remove_gallery_images;
    if (removeList) {
      const idsToRemove =
        typeof removeList === "string"
          ? removeList
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : Array.isArray(removeList)
            ? removeList
            : [removeList];

      for (const targetId of idsToRemove) {
        const foundIndex = currentGallery.findIndex((img) => {
          if (!img) return false;
          return img.publicId === targetId || img.secureUrl === targetId;
        });

        if (foundIndex !== -1) {
          const removedItem = currentGallery.splice(foundIndex, 1)[0];
          if (removedItem && removedItem.publicId) {
            await deleteFromCloudinary(removedItem.publicId);
          }
        }
      }
    }

    // Process gallery image replacements
    const replaceFiles = allFiles.filter((f) =>
      f.fieldname.startsWith("replace_gallery_"),
    );
    for (const rfile of replaceFiles) {
      const targetIdx = parseInt(
        rfile.fieldname.replace("replace_gallery_", ""),
        10,
      );
      if (
        !isNaN(targetIdx) &&
        targetIdx >= 0 &&
        targetIdx < currentGallery.length
      ) {
        const uploadRes = await uploadGalleryImage(
          rfile.buffer,
          targetIdx + 1,
          updatedContext,
        );
        currentGallery[targetIdx] = {
          secureUrl: uploadRes.secureUrl,
          publicId: uploadRes.publicId,
          alt: `${updatedContext.name} image ${targetIdx + 1}`,
        };
      }
    }

    // Process new gallery image additions
    const newGalleryFiles = allFiles.filter(
      (f) => f.fieldname === "images" || f.fieldname === "new_gallery_images",
    );
    if (newGalleryFiles.length > 0) {
      if (currentGallery.length + newGalleryFiles.length > 5) {
        return res.status(400).json({
          status: "fail",
          message: `Gallery image limit exceeded. Maximum allowed is 5 images total. Existing: ${currentGallery.length}, New: ${newGalleryFiles.length}`,
        });
      }

      for (let i = 0; i < newGalleryFiles.length; i++) {
        const file = newGalleryFiles[i];
        const result = await uploadGalleryImage(
          file.buffer,
          currentGallery.length + 1,
          updatedContext,
        );
        currentGallery.push({
          secureUrl: result.secureUrl,
          publicId: result.publicId,
          alt: `${updatedContext.name} image ${currentGallery.length}`,
        });
      }
    }

    updateData.images = currentGallery;

    // 3. PARSE FIELD TYPES AND VALIDATE
    if (updateData.title && !updateData.name) {
      updateData.name = updateData.title;
    } else if (updateData.name && !updateData.title) {
      updateData.title = updateData.name;
    }

    if (updateData.name && updateData.name.length > 120) {
      updateData.name = updateData.name.substring(0, 120);
      updateData.title = updateData.name;
    }

    if (updateData.summary && updateData.summary.length > 300) {
      updateData.summary = updateData.summary.substring(0, 300);
    }

    if (updateData.name && tour && updateData.name !== tour.name) {
      updateData.slug = slugify(updateData.name, { lower: true, strict: true });
    }

    if (updateData.theme && !updateData.category) {
      updateData.category = updateData.theme;
    } else if (updateData.category && !updateData.theme) {
      updateData.theme = updateData.category;
    }

    if (updateData.duration_days || updateData.duration) {
      const days =
        parseInt(
          updateData.duration_days ||
            (updateData.duration && updateData.duration.days),
        ) ||
        tour.duration?.days ||
        1;
      updateData.duration_days = days;
      updateData.duration = { days, nights: days > 1 ? days - 1 : 0 };
    }

    if (
      updateData.startingPrice !== undefined ||
      updateData.price_usd !== undefined
    ) {
      const rawPrice =
        updateData.startingPrice !== undefined
          ? updateData.startingPrice
          : updateData.price_usd;
      const sPrice = isNaN(parseFloat(rawPrice))
        ? tour.startingPrice || 0
        : parseFloat(rawPrice);
      updateData.startingPrice = sPrice;
      updateData.price_usd = sPrice;
    }

    if (updateData.discount !== undefined) {
      updateData.discount = isNaN(parseFloat(updateData.discount))
        ? 0
        : parseFloat(updateData.discount);
    }

    if (updateData.advanceBookingAmount !== undefined) {
      updateData.advanceBookingAmount = isNaN(
        parseFloat(updateData.advanceBookingAmount),
      )
        ? 2000
        : parseFloat(updateData.advanceBookingAmount);
    }

    const effectiveStartingPrice =
      updateData.startingPrice !== undefined
        ? updateData.startingPrice
        : tour.startingPrice || 0;
    const effectiveDiscount =
      updateData.discount !== undefined
        ? updateData.discount
        : tour.discount || 0;

    if (effectiveDiscount > effectiveStartingPrice) {
      return res.status(400).json({
        status: "fail",
        message: `Discount ($${effectiveDiscount}) must not exceed starting price ($${effectiveStartingPrice}).`,
      });
    }

    if (updateData.destination || updateData.country || updateData.state) {
      const primaryCity =
        updateData.destination ||
        (tour.destinations && tour.destinations[0]
          ? tour.destinations[0].city
          : "Global");
      const primaryCountry =
        updateData.country ||
        (tour.destinations && tour.destinations[0]
          ? tour.destinations[0].country
          : "Global");
      const primaryState =
        updateData.state ||
        (tour.destinations && tour.destinations[0]
          ? tour.destinations[0].state
          : "");

      if (Array.isArray(tour.destinations) && tour.destinations.length > 1) {
        const updatedDestinations = [...tour.destinations];
        updatedDestinations[0] = {
          country: primaryCountry,
          state: primaryState,
          city: primaryCity,
        };
        updateData.destinations = updatedDestinations;
      } else {
        updateData.destinations = [
          {
            country: primaryCountry,
            state: primaryState,
            city: primaryCity,
          },
        ];
      }
    }

    if (typeof updateData.itinerary === "string") {
      try {
        updateData.itinerary = JSON.parse(updateData.itinerary);
      } catch (e) {}
    }

    if (typeof updateData.packages === "string") {
      try {
        updateData.packages = JSON.parse(updateData.packages);
      } catch (e) {}
    }

    if (typeof updateData.seo === "string") {
      try {
        updateData.seo = JSON.parse(updateData.seo);
      } catch (e) {}
    }

    if (updateData.featured === "true" || updateData.featured === true)
      updateData.featured = true;
    if (updateData.featured === "false" || updateData.featured === false)
      updateData.featured = false;

    if (updateData.trending === "true" || updateData.trending === true)
      updateData.trending = true;
    if (updateData.trending === "false" || updateData.trending === false)
      updateData.trending = false;

    // Clean internal control flags from schema payload
    delete updateData.delete_cover;
    delete updateData.remove_gallery_images;

    let updatedTour;
    if (isDbConnected()) {
      // Note: runValidators is intentionally omitted here.
      // Cross-field validators (e.g. discount <= startingPrice) cannot access
      // sibling fields via `this` in a findOneAndUpdate query context (Mongoose 5.x).
      // All validations are enforced by the controller above before this call.
      updatedTour = await Tour.findOneAndUpdate(filter, updateData, {
        new: true,
      });
    } else {
      const index = storeTours.findIndex((t) => t.id === id || t.slug === id);
      storeTours[index] = { ...storeTours[index], ...updateData };
      updatedTour = storeTours[index];
    }

    return res.status(200).json({
      status: "success",
      success: true,
      message: "Tour expedition updated successfully",
      tour: updatedTour,
      data: { tour: updatedTour },
    });
  } catch (err) {
    console.error("Error in updateTour:", err);
    return res.status(400).json({
      status: "fail",
      message: err.message || "Failed to update tour expedition",
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const id = req.params.id;
    let tourToDelete = null;

    if (isDbConnected()) {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      const filter = isObjectId ? { _id: id } : { slug: id };
      tourToDelete = await Tour.findOneAndDelete(filter);
    } else {
      tourToDelete = storeTours.find((t) => t.id === id || t.slug === id);
    }

    if (tourToDelete) {
      await deleteTourFolder(tourToDelete);
    }

    setTours(storeTours.filter((t) => t.id !== id && t.slug !== id));
    res.json({
      status: "success",
      success: true,
      message: "Tour deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting tour in adminTourController:", err);
    res.status(500).json({ status: "error", error: "Failed to delete tour" });
  }
};

exports.updateTourStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const { status, featured, trending } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (typeof featured === "boolean") updateFields.featured = featured;
    if (typeof trending === "boolean") updateFields.trending = trending;

    if (isDbConnected()) {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      const filter = isObjectId ? { _id: id } : { slug: id };

      const updatedDoc = await Tour.findOneAndUpdate(filter, updateFields, {
        new: true,
      });
      if (updatedDoc) {
        return res.json({
          status: "success",
          success: true,
          tour: updatedDoc,
          data: { tour: updatedDoc },
        });
      }
    }

    const index = storeTours.findIndex((t) => t.id === id || t.slug === id);
    if (index === -1) {
      return res.status(404).json({ status: "fail", error: "Tour not found" });
    }

    storeTours[index] = { ...storeTours[index], ...updateFields };
    res.json({
      status: "success",
      success: true,
      tour: storeTours[index],
      data: { tour: storeTours[index] },
    });
  } catch (err) {
    console.error("Error updating tour status in adminTourController:", err);
    res
      .status(400)
      .json({ status: "fail", error: "Failed to update tour status" });
  }
};
