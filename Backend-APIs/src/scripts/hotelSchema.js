const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from config.env
dotenv.config({ path: path.join(__dirname, "../../config.env") });

const Tour = require("../models/tourModel");
async function migrateRoomTypes() {
    try {
      const DB = process.env.DATABASE.replace(
            "<PASSWORD>",
            process.env.DATABASE_PASSWORD,
          );
      
          await mongoose.connect(DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });

    const tours = await Tour.find();

    for (const tour of tours) {
      let updated = false;

      tour.packages.forEach((pkg) => {
        let roomType;

        switch (pkg.name) {
          case "Normal":
            roomType = "Standard";
            break;

          case "Standard":
            roomType = "Deluxe";
            break;

          case "Premium":
            roomType = "Suite";
            break;

          default:
            roomType = "Standard";
        }

        pkg.hotels.forEach((hotel) => {
          hotel.roomType = roomType;
          updated = true;
        });
      });

      if (updated) {
        await tour.save();
        console.log(`Updated: ${tour.name}`);
      }
    }

    console.log("✅ Migration completed.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

migrateRoomTypes();
