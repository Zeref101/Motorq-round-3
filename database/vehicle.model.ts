import { Schema, models, model, Document } from "mongoose";

interface IVehicle extends Document {
  brand: string;
  model_name: string;
  licensePlate: string;
}

const VehicleSchema = new Schema<IVehicle>({
  brand: { type: String, required: true },
  model_name: { type: String, required: true },
  licensePlate: { type: String, required: true },
});

const Vehicle = models.Vehicle || model("Vehicle", VehicleSchema);

export default Vehicle;
