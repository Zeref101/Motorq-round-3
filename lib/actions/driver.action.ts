"use server";
import { connectionToDatabase } from "../mongoose";
import Driver from "@/database/driver.model";
import { Schema } from "mongoose";

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
      return false;
    }

    const newDriver = new Driver({
      name,
      email,
      phone_number,
      location,
      assignment_requests: [], // Initialize assignment_requests as an empty array
    });
    await newDriver.save();
    return newDriver;
  } catch (error) {
    console.error("Error in createDriver:", error);
    throw new Error("Failed to create driver");
  }
}
export async function updateDriverByEmail(
  email: string,
  updates: {
    name?: string;
    phone_number?: number;
    location?: string;
    working_hours?: { day: string; start: string; end: string }[];
  }
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
    return true;
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

export async function getAllDrivers() {
  try {
    connectionToDatabase();
    const user = await Driver.find({});
    return JSON.stringify(user);
  } catch (error) {
    console.error("Error in getDriverById:", error);
    throw new Error("Failed to get driver by ID");
  }
}
export async function AllDrivers() {
  try {
    await connectionToDatabase(); // Ensure the database connection is established
    console.log("doneeeeeeeeeeeeeeeeeeee");
    const drivers = await Driver.find({});
    console.log(drivers);
    return drivers;
  } catch (error) {
    console.error("Error in getAllDrivers:", error);
    throw new Error("Failed to get all drivers");
  }
}
interface IAssignment {
  vehicle: Schema.Types.ObjectId;
  start_time: Date;
  end_time: Date;
}

export async function isDriverAvailable(
  driverId: string,
  startTime: Date,
  endTime: Date
): Promise<boolean> {
  try {
    connectionToDatabase(); // Ensure the database connection is established

    const driver = await Driver.findById(driverId).populate(
      "assignments.vehicle"
    );
    console.log(driver);
    if (!driver) {
      throw new Error("Driver not found");
    }

    const isAvailable = driver.assignments.every((assignment: IAssignment) => {
      return (
        endTime <= assignment.start_time || startTime >= assignment.end_time
      );
    });

    return isAvailable;
  } catch (error) {
    console.error("Error in isDriverAvailable:", error);
    throw new Error("Failed to check driver availability");
  }
}

export async function getAllUsersWithVehicleAssignments() {
  try {
    await connectionToDatabase(); // Ensure the database connection is established

    const users = await Driver.find({
      "assignments.vehicle": { $exists: true },
    }).populate("assignments.vehicle");

    return JSON.stringify(users);
  } catch (error) {
    console.error("Error in getAllUsersWithVehicleAssignments:", error);
    throw new Error("Failed to get users with vehicle assignments");
  }
}

export async function advSearchDrivers(location: string) {
  try {
    await connectionToDatabase();
    console.log(`Searching for drivers in location: ${location}`);

    const drivers = await Driver.find({ location });
    console.log(`Found drivers:`, drivers);

    // Filter out drivers with scheduling conflicts
    const availableDrivers = drivers.filter((driver) => {
      console.log(`Checking assignments for driver: ${driver.name}`);
      console.log(`Assignments:`, driver.assignments);

      // Check if the driver has any assignments
      return driver.assignments.length === 0;
    });

    console.log(`Available drivers:`, availableDrivers);
    return JSON.stringify(availableDrivers);
  } catch (error) {
    console.error("Error searching for drivers:", error);
    return [];
  }
}
