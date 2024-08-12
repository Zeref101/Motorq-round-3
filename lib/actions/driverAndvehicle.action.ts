"use server";

import { connectionToDatabase } from "../mongoose";
import Driver from "@/database/driver.model";
import Vehicle from "@/database/vehicle.model";

export async function assignDriverToVehicle(params: any) {
  try {
    connectionToDatabase();
    const { driverId, vehicleId } = params;

    // Ensure the driver is not already assigned to another vehicle
    const driver = await Driver.findById(driverId);
    if (driver.vehicle) {
      throw new Error("Driver is already assigned to a vehicle");
    }

    // Ensure the vehicle is not already assigned to another driver
    const vehicle = await Vehicle.findById(vehicleId);
    if (vehicle.driver) {
      throw new Error("Vehicle is already assigned to a driver");
    }

    // Assign the driver to the vehicle
    driver.vehicle = vehicleId;
    vehicle.driver = driverId;
    vehicle.available = false;
    await driver.save();
    await vehicle.save();

    return { driver, vehicle };
  } catch (error) {
    console.error("Error in assignDriverToVehicle:", error);
    throw new Error("Failed to assign driver to vehicle");
  }
}

export async function unassignDriverFromVehicle(params: any) {
  try {
    connectionToDatabase();
    const { driverId, vehicleId } = params;

    const driver = await Driver.findById(driverId);
    const vehicle = await Vehicle.findById(vehicleId);

    if (!driver || !vehicle) {
      throw new Error("Driver or Vehicle not found");
    }

    // Un-assign the driver from the vehicle
    driver.vehicle = null;
    vehicle.driver = null;
    await driver.save();
    await vehicle.save();

    return { driver, vehicle };
  } catch (error) {
    console.error("Error in unassignDriverFromVehicle:", error);
    throw new Error("Failed to unassign driver from vehicle");
  }
}
