const express = require("express");

const { protectAdminService } = require("../middlewares/protectAdminService");
const { uploadTourImages } = require("../middlewares/multer");

const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  updateTourStatus,
} = require("../controllers/admin/adminTourController");

const {
  getAllConsultations,
  getConsultation,
  updateConsultationStatus,
} = require("../controllers/admin/adminConsultantController");

const {
  getAllQueries,
  getQueryDetail,
  replyBookingQuery,
  updateQueryStatus,
} = require("../controllers/admin/adminBookingQueryController");

const {
  getAllBookings,
  getBookingDetails,
  verifyOrRejectDocuments,
  markPaymentFullPaid,
  markJourneyCompleted,
} = require("../controllers/admin/adminBookingController");

const {
  getDashboardOverview,
  getDashboardAnalytics,
  getDataCleaningPipeline,
  getPredictiveModels,
  getPythonLibraryUseCases,
  getFullDashboardOverview,
} = require("../controllers/admin/adminDashboardController");

const router = express.Router();

router.use(protectAdminService);

// Tour Management Routes
router.route("/tours").get(getAllTours).post(uploadTourImages, createTour);

router
  .route("/tours/:id")
  .get(getTour)
  .patch(uploadTourImages, updateTour)
  .put(uploadTourImages, updateTour)
  .delete(deleteTour);

router.patch("/tours/:id/status", updateTourStatus);

// Consultant Management Routes
router.route("/consultants").get(getAllConsultations);
router
  .route("/consultants/:id")
  .get(getConsultation)
  .patch(updateConsultationStatus);

// Booking Support Query Routes
router.route("/queries").get(getAllQueries);
router.route("/queries/:id").get(getQueryDetail);
router.post("/queries/:id/reply", replyBookingQuery);
router.patch("/queries/:id/status", updateQueryStatus);

// Document Verification & Bookings Management Routes
router.route("/bookings").get(getAllBookings);
router.route("/bookings/:bookingNumber").get(getBookingDetails);
router.post("/bookings/:id/verify-documents", verifyOrRejectDocuments);
router.patch("/bookings/:id/verify-documents", verifyOrRejectDocuments);
router.patch("/bookings/:id/payment-status", markPaymentFullPaid);
router.patch("/bookings/:id/booking-status", markJourneyCompleted);


// Admin Dashboard & Analytics Routes
router.get("/dashboard/overview", getDashboardOverview);
router.get("/dashboard/analytics", getDashboardAnalytics);
router.get("/dashboard/pipeline", getDataCleaningPipeline);
router.get("/dashboard/predictions", getPredictiveModels);
router.get("/dashboard/python-analytics", getPythonLibraryUseCases);
router.get("/dashboard/full-overview", getFullDashboardOverview);

module.exports = router;
