import { IWorkingHours } from "@/types";
import { Schema, models, model, Document } from "mongoose";

interface IDriver extends Document {
  name: string;
  email: string;
  phone_number: number;
  location?: string;
  assigned_vehicle: Schema.Types.ObjectId;
  working_hours: IWorkingHours[];
}
const WorkingHoursSchema = new Schema<IWorkingHours>({
  day: {
    type: String,
    required: true,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  start: { type: String, required: true },
  end: { type: String, required: true },
});

const DriverSchema = new Schema<IDriver>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone_number: { type: Number, required: true },
  location: { type: String, required: false },
  assigned_vehicle: {
    type: Schema.Types.ObjectId,
    ref: "Vehicle",
    required: false,
  },
  working_hours: { type: [WorkingHoursSchema], required: false },
});

const Driver = models.Driver || model("Driver", DriverSchema);

export default Driver;
