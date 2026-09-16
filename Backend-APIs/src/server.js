// always needs to first...
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../config.env") });


const mongoose = require("mongoose");
const PORT = 3001;




// Synchronise Syntax error..
process.on("uncaughtException", function (err) {
  console.log(err.name, err.message, err.stack);
  console.log("UNCAUGHT-EXCEPTION!");
  process.exit(1);
});


// connecting database
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

// console.log(process.env.DATABASE);
// console.log(process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB)
  .then((con) => {
    // console.log(con.connections);
    console.log("-----DB Connection------");
  });





const app = require("./app");
const server = app.listen(PORT, () =>
  console.log(`server is live`),
);


//Async Runtime System error
process.on("unhandledRejection", function (err) {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION!");
  server.close(() => {
    process.exit(1);
  });
});