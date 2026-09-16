const AppError = require("../utils/appError");

// ==========================
// MongoDB Errors
// ==========================

const handleCastErrorDB = (err) => {
  return new AppError(`Invalid ${err.path}: "${err.value}".`, 400);
};

const handleDuplicateFieldDB = (err) => {
  let field = "";
  let value = "";

  if (err.keyValue && Object.keys(err.keyValue).length > 0) {
    field = Object.keys(err.keyValue)[0];
    value = err.keyValue[field];
  } else {
    // Fallback: Extract from error message string if keyValue is unavailable
    const match = (err.errmsg || err.message || "").match(/(["'])(\\?.)*?\1/);
    value = match ? match[0].replace(/"/g, "") : "";
    field = "email";
  }

  const isEmail =
    field.toLowerCase() === "email" ||
    (err.message && err.message.toLowerCase().includes("email")) ||
    (err.errmsg && err.errmsg.toLowerCase().includes("email"));

  if (isEmail) {
    return new AppError(
      "An account with this email already exists. Please log in.",
      400
    );
  }

  const formattedField = field
    ? field.charAt(0).toUpperCase() + field.slice(1)
    : "Field";
  return new AppError(
    `${formattedField} "${value}" already exists. Please log in.`,
    400
  );
};

const handleValidationErrorDB = (err) => {
  const errors = err.errors
    ? Object.values(err.errors).map((el) => el.message)
    : [err.message];

  return new AppError(errors.join(". "), 400);
};

// ==========================
// JWT Errors
// ==========================

const handleJWTError = () =>
  new AppError("Invalid authentication token. Please log in again.", 401);

const handleJWTExpiredError = () =>
  new AppError("Your session has expired. Please log in again.", 401);

// ==========================
// Development Response
// ==========================

const sendErrorDevelopment = (err, res) => {
  return res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

// ==========================
// Production Response
// ==========================

const sendErrorProduction = (err, res) => {
  // Trusted (Operational) Error: Send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Unknown / Programming Error: Don't leak details to client
  console.error("UNEXPECTED ERROR 💥", err);

  return res.status(500).json({
    status: "error",
    message: "Something went wrong. Please try again later.",
  });
};

// ==========================
// Global Error Handler
// ==========================

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // 1. Clone error & copy non-enumerable properties
  let error = { ...err };

  error.name = err.name;
  error.message = err.message;
  error.statusCode = err.statusCode;
  error.status = err.status;
  error.isOperational = err.isOperational;
  error.code = err.code;
  error.keyValue = err.keyValue;
  error.errmsg = err.errmsg;
  error.errors = err.errors;
  error.path = err.path;
  error.value = err.value;

  // 2. Transform known DB and Auth errors into operational AppErrors FIRST
  const isDuplicateKey =
    error.code === 11000 ||
    error.code === "11000" ||
    (error.message && error.message.includes("E11000")) ||
    (error.errmsg && error.errmsg.includes("E11000"));

  if (error.name === "CastError") error = handleCastErrorDB(error);
  if (isDuplicateKey) error = handleDuplicateFieldDB(error);
  if (error.name === "ValidationError") error = handleValidationErrorDB(error);

  // JWT Error Transformations
  if (error.name === "JsonWebTokenError") error = handleJWTError();
  if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

  // 3. Send response according to Environment
  const env = (process.env.NODE_ENV || "").trim();

  if (env === "development") {
    return sendErrorDevelopment(error, res);
  }

  return sendErrorProduction(error, res);
};
