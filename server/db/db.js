import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose
      // Local connection
      .connect(process.env.MONGO_URI, {});
    // MongoDB Atlas
    // .connect(process.env.MONGO_URL, {});
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error(`${error} did not connect`);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
