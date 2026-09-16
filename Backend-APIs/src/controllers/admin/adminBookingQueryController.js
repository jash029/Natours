const Assistance = require("../../models/assistanceModel");
const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/error");
const Email = require("../../utils/email");

exports.getAllQueries = catchAsync(async (req, res, next) => {
  const { search, category, status } = req.query;

  const queryObj = {};

  if (category) {
    queryObj.category = category;
  }

  if (status) {
    queryObj.status = status;
  }

  let filter = Assistance.find(queryObj);

  if (search) {
    const searchRegex = new RegExp(search, "i");
    filter = filter.or([
      { subject: searchRegex },
      { message: searchRegex },
      { category: searchRegex },
    ]);
  }

  const queries = await filter
    .populate({
      path: "booking",
      select: "bookingNumber bookingStatus payment travelDate totalAmount",
    })
    .populate({
      path: "user",
      select: "name email phoneNumber",
    })
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    results: queries.length,
    queries,
  });
});

exports.getQueryDetail = catchAsync(async (req, res, next) => {
  const query = await Assistance.findById(req.params.id)
    .populate({
      path: "booking",
      populate: [
        {
          path: "tour",
          select: "name slug imageCover startingPrice duration theme",
        },
        {
          path: "user",
          select: "name email phoneNumber",
        },
      ],
    })
    .populate({
      path: "user",
      select: "name email phoneNumber photo",
    });

  if (!query) {
    return next(new AppError("Support query not found.", 404));
  }

  res.status(200).json({
    status: "success",
    query,
  });
});

exports.replyBookingQuery = catchAsync(async (req, res, next) => {
  const { message, status } = req.body;

  if (!message || !message.trim()) {
    return next(new AppError("Please provide a response message.", 400));
  }

  const query = await Assistance.findById(req.params.id).populate({
    path : 'user',
    select : 'name email'
  });

  if (!query) {
    return next(new AppError("Support query not found.", 404));
  }

  const newResponse = {
    sender: "support",
    message: message.trim(),
    createdAt: new Date(),
  };

  query.responses.push(newResponse);
  query.status =
    status || (query.status === "Open" ? "In Progress" : query.status);

  await query.save();

  // Send Email directly to user
  try {
    if (query.user) {
      await new Email(query.user, "").sendBookingQueryReply(
        query,
        message.trim(),
      );
    }
  } catch (err) {
    console.error("Error sending query reply email:", err.message);
  }

  res.status(200).json({
    status: "success",
    message: "Reply sent and recorded successfully.",
    query,
  });
});

exports.updateQueryStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return next(new AppError("Please provide a valid status.", 400));
  }

  const query = await Assistance.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true },
  ).populate("user");

  if (!query) {
    return next(new AppError("Support query not found.", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Query status updated successfully.",
    query,
  });
});
