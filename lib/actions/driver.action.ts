"use server";
import { connectionToDatabase } from "../mongoose";
import Driver from "@/database/driver.model";

export async function getDriverByEmail(params: any) {
  try {
    connectionToDatabase();
    const { userEmail } = params;
    const user = await Driver.findOne({ email: userEmail });
    return user;
  } catch (error) {
    console.error("Error in getDriverById:", error);
    throw new Error("Failed to get driver by ID");
  }
}

export async function createDriver(params: any) {
  try {
    await connectionToDatabase();
    const { name, email, phone_number, location } = params;

    // Check if a driver with the same email already exists
    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      throw new Error("Driver with this email already exists");
    }

    const newDriver = new Driver({ name, email, phone_number, location });
    await newDriver.save();
    return newDriver;
  } catch (error) {
    console.error("Error in createDriver:", error);
    throw new Error("Failed to create driver");
  }
}

export async function updateDriverByEmail(
  email: string,
  updates: { name?: string; phone_number?: number; location?: string }
) {
  try {
    connectionToDatabase();
    const updatedDriver = await Driver.findOneAndUpdate(
      { email },
      { $set: updates },
      { new: true }
    );
    if (!updatedDriver) {
      throw new Error("Driver not found");
    }
    return updatedDriver;
  } catch (error) {
    console.error("Error in updateDriverByEmail:", error);
    throw new Error("Failed to update driver");
  }
}

export async function searchDrivers(query: string) {
  try {
    connectionToDatabase(); // Ensure the database connection is established
    console.log(query);
    let searchCriteria;
    if (isNaN(Number(query))) {
      // If the query is not a number, search by name
      searchCriteria = { name: { $regex: `^${query}`, $options: "i" } };
    } else {
      // If the query is a number, search by phone number
      searchCriteria = { phone_number: { $regex: `^${query}` } };
    }

    const drivers = await Driver.find(searchCriteria);
    return drivers;
  } catch (error) {
    console.error("Error in searchDrivers:", error);
    throw new Error("Failed to search drivers");
  }
}
