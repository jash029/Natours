const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../../config.env") });

const Tour = require("../models/tourModel");

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

async function testCountry() {
  for (let i = 0; i < 5; i++) {
    try {
      await mongoose.connect(DB);
      
      const usaUpper = await Tour.find({ status: "published", "destinations.country": "USA" });
      const usaTitle = await Tour.find({ status: "published", "destinations.country": "Usa" });
      const usaRegex = await Tour.find({ status: "published", "destinations.country": { $regex: /^usa$/i } });
      
      console.log("USA (exact uppercase):", usaUpper.length);
      console.log("Usa (Titlecase):", usaTitle.length);
      console.log("USA (regex case-insensitive):", usaRegex.length);
      
      if (usaRegex.length > 0) {
        console.log("Sample country field in DB:", usaRegex[0].destinations[0]?.country);
      }
      
      await mongoose.disconnect();
      process.exit(0);
    } catch (e) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

testCountry();
