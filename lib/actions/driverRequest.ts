"use server";

import { connectionToDatabase } from "../mongoose";
import Driver from "@/database/driver.model";
import Vehicle from "@/database/vehicle.model";
import { ObjectId } from "mongoose";

interface Driver {
  assigned_vehicle: ObjectId | null;
  assignments: Array<{ vehicle: ObjectId; start_time: Date; end_time: Date }>;
  assignment_requests: Array<{
    vehicle: ObjectId;
    start_time: Date;
    end_time: Date;
  }>;
  save: () => Promise<void>;
}

interface Vehicle {
  available: boolean;
  save: () => Promise<void>;
}

export async function sendAssignmentRequest(params: any) {
  try {
    await connectionToDatabase();
    const { driverIds, vehicleId, startTime, endTime } = params;

    console.log(driverIds);

    const vehicle = await Vehicle.findById(vehicleId);
    console.log(vehicle);
    if (!vehicle || !vehicle.available) {
      throw new Error("Vehicle is not available");
    }

    for (const driverId of driverIds) {
      const driver = await Driver.findById(driverId);
      console.log(driver);
      if (driver) {
        if (!driver.assignment_requests) {
          driver.assignment_requests = [];
        }
        driver.assignment_requests.push({
          vehicle: vehicleId,
          start_time: startTime,
          end_time: endTime,
          status: "pending",
        });
        await driver.save();
        console.log("Updated driver:", driver);
      }
    }

    return true;
  } catch (error) {
    console.error("Error in sendAssignmentRequest:", error);
    throw new Error("Failed to send assignment request");
  }
}

export async function acceptAssignmentRequest(params: any) {
  try {
    await connectionToDatabase();
    // console.log("hiiiiiiiiiii", vehicleId);
    const { driverEmail, vehicleId, startTime, endTime } = params;

    console.log(
      driverEmail,
      vehicleId,
      startTime,
      endTime,
      "hiiiiiiiiiiiiiiiiiiii"
    );
    const driver = await Driver.findOne({ email: driverEmail });
    if (!driver) {
      throw new Error("Driver not found");
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || !vehicle.available) {
      throw new Error("Vehicle is not available");
    }

    // Check if the assignment has already been accepted by another driver
    const existingRequest = driver.assignment_requests.find(
      (request) =>
        request.vehicle.toString() === vehicleId &&
        request.start_time.getTime() === new Date(startTime).getTime() &&
        request.end_time.getTime() === new Date(endTime).getTime() &&
        request.status === "accepted"
    );

    if (existingRequest) {
      throw new Error("Assignment has already been accepted by another driver");
    }

    // Accept the assignment
    const request = driver.assignment_requests.find(
      (request) =>
        request.vehicle.toString() === vehicleId &&
        request.start_time.getTime() === new Date(startTime).getTime() &&
        request.end_time.getTime() === new Date(endTime).getTime() &&
        request.status === "pending"
    );

    if (request) {
      request.status = "accepted";
      await driver.save();
      return true;
    } else {
      throw new Error("Assignment request not found");
    }
  } catch (error) {
    console.error("Error in acceptAssignmentRequest:", error);
    throw new Error("Failed to accept assignment request");
  }
}
export async function rejectAssignmentRequest(params: any) {
  try {
    await connectionToDatabase();
    const { driverId, vehicleId } = params;

    const driver = await Driver.findById(driverId);
    if (!driver) {
      throw new Error("Driver not found");
    }

    driver.assignment_requests = driver.assignment_requests.filter(
      (request: any) => request.vehicle.toString() !== vehicleId
    );
    await driver.save();

    return true;
  } catch (error) {
    console.error("Error in rejectAssignmentRequest:", error);
    throw new Error("Failed to reject assignment request");
  }
}
export async function getDriverAssignmentRequests(driverEmail: string) {
  try {
    await connectionToDatabase();
    const driver = await Driver.findOne({ email: driverEmail }).populate(
      "assignment_requests.vehicle"
    );
    // console.log(driver);
    if (!driver) {
      return false;
    }
    console.log(JSON.parse(JSON.stringify(driver.assignment_requests)));
    return JSON.stringify(driver.assignment_requests);
  } catch (error) {
    console.error("Error in getDriverAssignmentRequests:", error);
    throw new Error("Failed to fetch assignment requests");
  }
}
