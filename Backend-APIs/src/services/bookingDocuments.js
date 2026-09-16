const path = require("path");
const {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} = require("./cloudinary.service");
const AppError = require("../utils/appError");


const getBookingFolderPath = (userId, bookingNumber) => {
  if (!userId || !bookingNumber) {
    throw new AppError("User id and booking number are required.", 500);
  }

  return `natours/bookings/${userId}/${bookingNumber}`;
};

/* ===========================================================
   SINGLE DOCUMENT
=========================================================== */

const uploadBookingDocument = async ({
  file,
  userId,
  bookingNumber,
  travelerIndex,
  documentType,
}) => {
  if (!file) return null;

  const folder = `${getBookingFolderPath(
    userId,
    bookingNumber,
  )}/traveler_${travelerIndex}`;

  const ext = path.extname(file.originalname);

  const result = await uploadBufferToCloudinary(
    file.buffer,
    folder,
    documentType,
    {
      resource_type: file.mimetype === "application/pdf" ? "raw" : "image",

      overwrite: true,

      format: ext.length > 1 ? ext.substring(1) : undefined,
    },
  );

  return {
    publicId: result.publicId,
    secureUrl: result.secureUrl,
  };
};

/* ===========================================================
   HELPERS
=========================================================== */

const findFile = (files, fieldname) =>
  files.find((file) => file.fieldname === fieldname);

/* ===========================================================
   ONE TRAVELER
=========================================================== */

const uploadTravelerDocuments = async ({
  traveler,
  travelerIndex,
  files,
  userId,
  bookingNumber,
}) => {
  const passport = findFile(files, `traveler_${travelerIndex}_passport`);

  const visa = findFile(files, `traveler_${travelerIndex}_visa`);

  const nationalId = findFile(files, `traveler_${travelerIndex}_nationalId`);

  const insurance = findFile(files, `traveler_${travelerIndex}_insurance`);

  if (passport) {
    traveler.travelDocuments.passport.file = await uploadBookingDocument({
      file: passport,
      userId,
      bookingNumber,
      travelerIndex: travelerIndex + 1,
      documentType: "passport",
    });
  }

  if (visa) {
    traveler.travelDocuments.visa.file = await uploadBookingDocument({
      file: visa,
      userId,
      bookingNumber,
      travelerIndex: travelerIndex + 1,
      documentType: "visa",
    });
  }

  if (nationalId) {
    traveler.travelDocuments.nationalId.file = await uploadBookingDocument({
      file: nationalId,
      userId,
      bookingNumber,
      travelerIndex: travelerIndex + 1,
      documentType: "nationalId",
    });
  }

  if (insurance) {
    traveler.travelDocuments.insurance.file = await uploadBookingDocument({
      file: insurance,
      userId,
      bookingNumber,
      travelerIndex: travelerIndex + 1,
      documentType: "insurance",
    });
  }

  return traveler;
};

/* ===========================================================
   ALL TRAVELERS
=========================================================== */

const uploadAllTravelerDocuments = async ({
  travelers,
  files,
  userId,
  bookingNumber,
}) => {
  const uploadedTravelers = [];

  for (let i = 0; i < travelers.length; i++) {
    uploadedTravelers.push(
      await uploadTravelerDocuments({
        traveler: travelers[i],
        travelerIndex: i,
        files,
        userId,
        bookingNumber,
      }),
    );
  }

  return uploadedTravelers;
};

/* ===========================================================
   DELETE BOOKING
=========================================================== */

const deleteBookingFolder = async (userId, bookingNumber) => {
  const cloudinary = require("../config/cloudinary");

  const folder = getBookingFolderPath(userId, bookingNumber);

  try {
    await cloudinary.api.delete_resources_by_prefix(folder);

    for (let i = 1; i <= 50; i++) {
      try {
        await cloudinary.api.delete_folder(`${folder}/traveler_${i}`);
      } catch (_) {}
    }

    try {
      await cloudinary.api.delete_folder(folder);
    } catch (_) {}
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getBookingFolderPath,
  uploadBookingDocument,
  uploadTravelerDocuments,
  uploadAllTravelerDocuments,
  deleteBookingFolder,
};
