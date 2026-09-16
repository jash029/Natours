const express = require("express");
const app = express();
const router = new express.Router();


const { signup, login, protect, logout, forgetPassword, resetPassword, updatePassword,verifyEmail,cancelSignup, deleteAccount } = require("../controllers/authController");
const userController = require("../controllers/userController");
const reviewController = require("../controllers/reviewController");

const {
  uploadUserPhoto
} = require("../middlewares/multer");



router.post("/signup", signup);
router.post("/login", login);

router.post("/forgetPassword", forgetPassword);
router.patch("/resetPassword/:token", resetPassword);
router.post('/verifyEmail', verifyEmail);
router.delete('/cancelSignUp', cancelSignup);
router.post("/consultant", userController.consultantQuery);


router.use(protect);

router.route("/logout").get(logout);
router.patch("/updatePassword", updatePassword);
router.get("/getMe", userController.getMe);
router.patch('/updateMe', uploadUserPhoto, userController.updateMe);
router.delete("/deleteUser", deleteAccount);
router.get("/getBookmarkTour", userController.getBookmarks);
router.post("/addBookmarkTour", userController.addBookmarkTour);
router.patch("/removeBookmark", userController.removeBookmarkTour);
router.post("/bookingQuery" , userController.bookingQuery);
router.get("/getAllMyBookingQuery",userController.getMyBookingQueries);
router.get("/getDetailedBookingQuery/:id",userController.getMyBookingQuery);

router.post("/createReview", reviewController.createReview);
router.get("/getAllReviews", reviewController.getMyReviews);
module.exports = router;