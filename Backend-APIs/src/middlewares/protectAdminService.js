exports.protectAdminService = (req, res, next) => {
  const serviceKey =
    process.env.ADMIN_SERVICE_KEY || "vanguard_admin_service_secret_key_2026";

  const providedKey =
    req.headers["x-admin-service-key"] ||
    (req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!providedKey || providedKey !== serviceKey) {
    return res.status(401).json({
      status: "fail",
      error: "Unauthorized: Invalid or missing admin service token.",
    });
  }

  next();
};
