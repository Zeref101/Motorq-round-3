import { Schema, models, model, Document } from "mongoose";

interface IDriver extends Document {
  name: string;
  email: string;
  phone_number: number;
  location?: string;
}

const DriverSchema = new Schema<IDriver>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone_number: { type: Number, required: true },
  location: { type: String, required: false },
});

const Driver = models.Driver || model("Driver", DriverSchema);

export default Driver;
