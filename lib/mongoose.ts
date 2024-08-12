import mongoose from "mongoose";

export const connectionToDatabase = async () => {
  mongoose.set("strict", true);

  if (!process.env.MONGODB_URI) {
    return console.log("MISSING MONGODB_URI");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "MotorQ-Assignment",
    });
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.log(error);
  }
};
