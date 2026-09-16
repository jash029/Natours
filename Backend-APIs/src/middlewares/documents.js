const multer = require("multer");
const AppError = require("../utils/appError");

const storage = multer.memoryStorage();

const documentFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf",

    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Only PDF, JPG, JPEG, PNG and WEBP documents are allowed.",
        400,
      ),
      false,
    );
  }
};

const uploadDocuments = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: documentFilter,
});

exports.uploadBookingDocuments = uploadDocuments.any();
