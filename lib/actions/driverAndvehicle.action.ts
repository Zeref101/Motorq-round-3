"use server";

import { connectionToDatabase } from "../mongoose";
import Driver from "@/database/driver.model";
import Vehicle from "@/database/vehicle.model";
import { ObjectId } from "mongoose";

interface Driver {
  assigned_vehicle: ObjectId | null;
  assignments: Array<{ vehicle: ObjectId; start_time: Date; end_time: Date }>;
  save: () => Promise<void>;
}

interface Vehicle {
  available: boolean;
  save: () => Promise<void>;
}

export async function assignDriverToVehicle(params: any) {
  try {
    await connectionToDatabase();
    const { driverId, vehicleId, startTime, endTime } = params;

    // Ensure the driver is not already assigned to another vehicle
    const driver = await Driver.findById(driverId);
    if (driver?.assigned_vehicle) {
      throw new Error("Driver is already assigned to a vehicle");
    }

    // Ensure the vehicle is not already assigned to another driver
    const vehicle = await Vehicle.findById(vehicleId);

    // Assign the driver to the vehicle
    if (driver) {
      driver.assigned_vehicle = vehicleId;
      driver.assignments.push({
        vehicle: vehicleId,
        start_time: startTime,
        end_time: endTime,
      });
      await driver.save();
    }

    if (vehicle) {
      vehicle.available = false;
      await vehicle.save();
    }

    return true;
  } catch (error) {
    console.error("Error in assignDriverToVehicle:", error);
    throw new Error("Failed to assign driver to vehicle");
  }
}

export async function unassignDriverFromVehicle(params: any) {
  try {
    await connectionToDatabase();
    const { driverId, vehicleId } = params;

    const driver = (await Driver.findById(driverId)) as Driver;
    const vehicle = await Vehicle.findById(vehicleId);

    if (!driver || !vehicle) {
      throw new Error("Driver or Vehicle not found");
    }

    // Check if the vehicle is assigned to the driver
    if (driver.assigned_vehicle?.toString() !== vehicleId) {
      throw new Error("Vehicle is not assigned to the driver");
    }

    // Un-assign the driver from the vehicle
    driver.assigned_vehicle = null;
    vehicle.available = true;

    // Update the driver's assignments
    driver.assignments = driver.assignments.filter(
      (assignment: any) => assignment.vehicle.toString() !== vehicleId
    );

    await driver.save();
    await vehicle.save();

    return true;
  } catch (error) {
    console.error("Error in unassignDriverFromVehicle:", error);
    throw new Error("Failed to unassign driver from vehicle");
  }
}
