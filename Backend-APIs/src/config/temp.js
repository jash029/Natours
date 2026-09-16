const cloudinary = require("./cloudinary");

exports.temp = async function (req, res, next) {
  try {
    const result = await cloudinary.api.ping();

    console.log(result);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};
