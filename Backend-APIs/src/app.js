const express = require("express");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const globalErrorMiddleware = require("./middlewares/globalErrorMiddleWare");
const userRoute = require("./routers/userRoute");
const tourRoute = require("./routers/tourRoute");
const adminRoute = require("./routers/adminRoute");
const bookingRoute = require("./routers/bookingRoute");
const limit = require('express-rate-limit');
const app = express();
console.log("App initialized");

app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.originalUrl);
  next();
});
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());


const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
const limiter = limit({
  windowMs: 15 * 60 * 1000, // 1 hour
  max: 1000,
  handler: (req, res, next) => {
    next(
      new AppError(
        "Too many requests from this IP. Please try again in 15 minutes.",
        429,
      ),
    );
  },
});

app.use("/api", limiter);


app.use("/api/v1/user", userRoute);
app.use("/api/v1/tours", tourRoute);
app.use("/api/v1/admin", adminRoute);
app.use('/api/v1/booking', bookingRoute);
// app.all("/{*any}", (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

app.use(globalErrorMiddleware);

module.exports = app;
