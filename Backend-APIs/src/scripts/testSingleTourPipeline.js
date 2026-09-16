const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../../config.env") });
const mongoose = require("mongoose");
const axios = require("axios");
const sharp = require("sharp");
const streamifier = require("streamifier");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: (process.env.CLOUDINARY_CLOUD_NAME || "").trim(),
  api_key: (process.env.CLOUDINARY_API_KEY || process.env["CLOUDINARY_API_KEY "] || "").trim(),
  api_secret: (process.env.CLOUDINARY_API_SECRET || "").trim(),
});

const Tour = require("../models/tourModel");

const pool = [
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2560&q=85",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2560&q=85"
];

async function testSingle() {
  const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
  await mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true });

  const tour = await Tour.findOne({ name: /American Rocky Mountain/i });
  console.log("Found Tour:", tour.name);
  console.log("Cover publicId:", tour.imageCover.publicId);
  console.log("Gallery publicIds:", tour.images.map(i => i.publicId));

  const candidates = [];
  for (const url of pool) {
    try {
      console.log("Fetching:", url.slice(0, 45));
      const res = await axios.get(url, { responseType: "arraybuffer", timeout: 10000 });
      const rawBuffer = Buffer.from(res.data);
      const meta = await sharp(rawBuffer).metadata();
      console.log("  Success:", meta.width, "x", meta.height, meta.format);
      candidates.push({ buffer: rawBuffer, url });
    } catch (e) {
      console.error("  Error fetching:", e.message);
    }
  }

  console.log("Total candidates fetched:", candidates.length);

  if (candidates.length >= 6) {
    console.log("Overwriting cover...");
    const coverBuffer = await sharp(candidates[0].buffer).resize(2560, 1440, { fit: "inside" }).toFormat("jpeg").toBuffer();
    await new Promise((res, rej) => {
      const stream = cloudinary.uploader.upload_stream(
        { public_id: tour.imageCover.publicId, overwrite: true, invalidate: true, resource_type: "image" },
        (err, result) => { if (err) return rej(err); res(result); }
      );
      streamifier.createReadStream(coverBuffer).pipe(stream);
    });
    console.log("Cover overwrite SUCCESS!");

    for (let i = 0; i < 5; i++) {
      console.log(`Overwriting gallery ${i + 1}/5...`);
      const gBuffer = await sharp(candidates[i + 1].buffer).resize(2560, 1440, { fit: "inside" }).toFormat("jpeg").toBuffer();
      await new Promise((res, rej) => {
        const stream = cloudinary.uploader.upload_stream(
          { public_id: tour.images[i].publicId, overwrite: true, invalidate: true, resource_type: "image" },
          (err, result) => { if (err) return rej(err); res(result); }
        );
        streamifier.createReadStream(gBuffer).pipe(stream);
      });
      console.log(`Gallery ${i + 1} SUCCESS!`);
    }

    console.log("TOUR 1 COMPLETED 100% SUCCESSFULLY WITH ZERO MONGODB EDITS!");
  }

  await mongoose.connection.close();
}

testSingle().catch(err => console.error("Test failed:", err));
