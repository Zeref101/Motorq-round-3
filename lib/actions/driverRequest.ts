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

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || !vehicle.available) {
      throw new Error("Vehicle is not available");
    }

    for (const driverId of driverIds) {
      const driver = await Driver.findById(driverId);
      if (driver) {
        driver.assignment_requests.push({
          vehicle: vehicleId,
          start_time: startTime,
          end_time: endTime,
        });
        await driver.save();
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
    const { driverId, vehicleId } = params;

    const driver = await Driver.findById(driverId);
    const vehicle = await Vehicle.findById(vehicleId);

    if (!driver || !vehicle) {
      throw new Error("Driver or Vehicle not found");
    }

    if (!vehicle.available) {
      throw new Error("Vehicle is already assigned");
    }

    // Assign the driver to the vehicle
    driver.assigned_vehicle = vehicleId;
    driver.assignments.push({
      vehicle: vehicleId,
      start_time: new Date(),
      end_time: new Date(), // Set appropriate end time
    });
    driver.assignment_requests = driver.assignment_requests.filter(
      (request: any) => request.vehicle.toString() !== vehicleId
    );
    await driver.save();

    vehicle.available = false;
    await vehicle.save();

    return true;
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
    if (!driver) {
      return false;
    }
    return driver.assignment_requests;
  } catch (error) {
    console.error("Error in getDriverAssignmentRequests:", error);
    throw new Error("Failed to fetch assignment requests");
  }
}
