const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../../config.env") });
const mongoose = require("mongoose");
const sharp = require("sharp");
const axios = require("axios");
const streamifier = require("streamifier");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
  api_key: process.env.CLOUDINARY_API_KEY.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
});

const Tour = require("../models/tourModel");

async function testSingleOverwrite() {
  const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
  await mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true });
  
  const tour = await Tour.findOne({ name: /American Rocky Mountain/i });
  console.log("Testing tour:", tour.name);
  console.log("Cover publicId:", tour.imageCover.publicId);

  // Fetch a test high-res image
  const imgUrl = "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=2560&q=85";
  const res = await axios.get(imgUrl, { responseType: "arraybuffer" });
  const buffer = Buffer.from(res.data);

  const optimized = await sharp(buffer)
    .resize(2560, 1440, { fit: "inside" })
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer();

  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: tour.imageCover.publicId,
        overwrite: true,
        invalidate: true,
        resource_type: "image",
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    streamifier.createReadStream(optimized).pipe(stream);
  });

  console.log("Cloudinary Upload SUCCESS!");
  console.log("Returned Public ID:", uploadResult.public_id);
  console.log("Returned Secure URL:", uploadResult.secure_url);
  console.log("Bytes:", uploadResult.bytes);
  console.log("Width x Height:", uploadResult.width, "x", uploadResult.height);

  await mongoose.connection.close();
}

testSingleOverwrite().catch(err => console.error("Test error:", err));
