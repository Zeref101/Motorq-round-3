import { connectionToDatabase } from "../mongoose";
import Vehicle from "@/database/vehicle.model";

export async function createVehicle(params: any) {
  try {
    connectionToDatabase();
    const { brand, model_name, licensePlate, fuel, available, transmission } =
      params;

    // Check if a vehicle with the same license plate already exists
    const existingVehicle = await Vehicle.findOne({ licensePlate });
    if (existingVehicle) {
      throw new Error("Vehicle with the same license plate already exists");
    }

    // Create a new vehicle
    const newVehicle = new Vehicle({
      brand,
      model_name,
      licensePlate,
      fuel,
      available,
      transmission,
    });
    await newVehicle.save();
    return newVehicle;
  } catch (error) {
    console.error("Error in createVehicle:", error);
    throw new Error("Failed to create vehicle");
  }
}
