import { connectionToDatabase } from "../mongoose";
import Vehicle from "@/database/vehicle.model";

export async function createVehicle(params: any) {
  try {
    connectionToDatabase();
    const { brand, model_name } = params;
    const newVehicle = new Vehicle({ brand, model_name });
    await newVehicle.save();
    return newVehicle;
  } catch (error) {
    console.error("Error in createVehicle:", error);
    throw new Error("Failed to create vehicle");
  }
}
