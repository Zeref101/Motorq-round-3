import mongoose from "mongoose";

export const connectionToDatabase = async () => {
  // if (!process.env.MONGODB_URI) {
  //   return console.log("MISSING MONGODB_URI");
  // }

  try {
    await mongoose.connect(
      "mongodb+srv://Shreyas:thedarkslayer@cluster0.xkioikl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        dbName: "MotorQ-Assignment",
      }
    );
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.log(error);
  }
};
