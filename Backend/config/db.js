import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("✅ MongoDB Connected");
};

export default connectDB;
