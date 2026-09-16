const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../../config.env") });

const Tour = require("../models/tourModel");

const run = async () => {
  const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

  let connected = false;
  for (let i = 1; i <= 10; i++) {
    try {
      console.log(`Connection attempt ${i}...`);
      await mongoose.connect(DB, { serverSelectionTimeoutMS: 5000 });
      if (mongoose.connection.readyState === 1) {
        connected = true;
        console.log("Connected to MongoDB Atlas successfully.\n");
        break;
      }
    } catch (err) {
      console.log(`Attempt ${i} failed (${err.message}). Retrying in 2 seconds...`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  if (!connected) {
    console.error("Could not connect to MongoDB Atlas after 10 attempts.");
    process.exit(1);
  }

  const query = {
    $or: [
      {
        "destinations.country": "Norway",
        theme: { $regex: /^forests?$/i },
      },
      {
        "destinations.country": { $regex: /^italy$/i },
        theme: { $regex: /^forests?$/i },
      },
    ],
  };

  const toursToDelete = await Tour.find(query);

  console.log(`Found ${toursToDelete.length} tour(s) matching deletion criteria:\n`);

  for (const tour of toursToDelete) {
    const country = tour.destinations?.[0]?.country || "Unknown";
    console.log(`- ID: ${tour._id}`);
    console.log(`  Name: ${tour.name}`);
    console.log(`  Country: ${country}`);
    console.log(`  Theme: ${tour.theme}\n`);
  }

  if (toursToDelete.length > 0) {
    const deleteResult = await Tour.deleteMany(query);
    console.log(`======================================`);
    console.log(`Deletion Completed Successfully`);
    console.log(`Total Tours Deleted: ${deleteResult.deletedCount}`);
    console.log(`======================================`);
  } else {
    console.log("No matching tours found to delete.");
  }

  await mongoose.disconnect();
  process.exit(0);
};

run();
