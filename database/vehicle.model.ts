import { Schema, models, model, Document, Model } from "mongoose";

interface IVehicle extends Document {
  brand: string;
  model_name: string;
  licensePlate: string;
  fuel: string;
  available: boolean;
  transmission: string;
  status: "pending" | "accepted" | "rejected"; // Add status field with specific values
}

const VehicleSchema = new Schema<IVehicle>({
  brand: { type: String, required: true },
  model_name: { type: String, required: true },
  licensePlate: { type: String, required: true },
  fuel: { type: String, required: false },
  available: { type: Boolean, required: false },
  transmission: { type: String, required: false },
  status: {
    type: String,
    required: true,
    enum: ["pending", "accepted", "rejected"], // Ensure status can only be one of these values
    default: "pending", // Set default value to "pending"
  },
});

const Vehicle: Model<IVehicle> =
  models?.Vehicle || model<IVehicle>("Vehicle", VehicleSchema);

export default Vehicle;
