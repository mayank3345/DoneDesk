const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database is connected");
  } catch (error) {
    console.error("Error in connecting DB", error);
    process.exit(1);
  }
};
module.exports = connectDB;
