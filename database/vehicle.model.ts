import { Schema, models, model, Document, Model } from "mongoose";

interface IVehicle extends Document {
  brand: string;
  model_name: string;
  licensePlate: string;
  fuel: string;
  available: boolean;
  transmission: string;
}

const VehicleSchema = new Schema<IVehicle>({
  brand: { type: String, required: true },
  model_name: { type: String, required: true },
  licensePlate: { type: String, required: true },
  fuel: { type: String, required: false },
  available: { type: Boolean, required: false },
  transmission: { type: String, required: false },
});

const Vehicle: Model<IVehicle> =
  models?.Vehicle || model<IVehicle>("Vehicle", VehicleSchema);

export default Vehicle;
