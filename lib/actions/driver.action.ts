"user server";

import { connectionToDatabase } from "../mongoose";
import Driver from "@/database/driver.model";

export async function getDriverById(params: any) {
  try {
    connectionToDatabase();
    const { userId } = params;
    const user = await Driver.findOne({ _id: userId });
    return user;
  } catch (error) {
    console.error("Error in getDriverById:", error);
    throw new Error("Failed to get driver by ID");
  }
}

export async function createDriver(params: any) {
  try {
    connectionToDatabase();
    const { name, phone } = params;
    const newDriver = new Driver({ name, phone });
    await newDriver.save();
    return newDriver;
  } catch (error) {
    console.error("Error in createDriver:", error);
    throw new Error("Failed to create driver");
  }
}
