const { MongoClient } = require("mongodb");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../../config.env") });

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

const run = async () => {
  console.log("Connecting to MongoDB Atlas...");
  
  let client;
  for (let i = 1; i <= 15; i++) {
    try {
      client = new MongoClient(DB, {
        tls: true,
        tlsAllowInvalidCertificates: true,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 20000,
      });
      await client.connect();
      console.log(`Successfully connected on attempt ${i}!`);
      break;
    } catch (err) {
      console.log(`Connection attempt ${i} failed: ${err.message}. Retrying...`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  if (!client) {
    console.error("Could not connect to MongoDB after 15 attempts.");
    process.exit(1);
  }

  try {
    const db = client.db();
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

    const matchingTours = await db.collection("tours").find(query).toArray();

    console.log(`Found ${matchingTours.length} tour(s) matching criteria:`);
    for (const t of matchingTours) {
      const country = t.destinations?.[0]?.country || "Unknown";
      console.log(` - Tour ID: ${t._id}`);
      console.log(`   Name: ${t.name}`);
      console.log(`   Country: ${country}`);
      console.log(`   Theme: ${t.theme}\n`);
    }

    const deleteRes = await db.collection("tours").deleteMany(query);

    console.log("======================================");
    console.log("Deletion Completed Successfully");
    console.log(`Total Tours Deleted from MongoDB: ${deleteRes.deletedCount}`);
    console.log("======================================");
  } catch (err) {
    console.error("Error during deletion operation:", err.message);
  } finally {
    await client.close();
    process.exit(0);
  }
};

run();
