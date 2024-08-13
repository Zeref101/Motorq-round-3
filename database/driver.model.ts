import { IWorkingHours } from "@/types";
import { Schema, models, model, Document, Model } from "mongoose";

interface IAssignment {
  vehicle: Schema.Types.ObjectId;
  start_time: Date;
  end_time: Date;
}

interface IDriver extends Document {
  name: string;
  email: string;
  phone_number: number;
  location?: string;
  assigned_vehicle: Schema.Types.ObjectId;
  working_hours: IWorkingHours[];
  assignments: IAssignment[];
  assignment_requests: IAssignment[];
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
  start: { type: Date, required: true },
  end: { type: Date, required: true },
});

const AssignmentSchema = new Schema<IAssignment>({
  vehicle: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
});

const DriverSchema = new Schema<IDriver>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone_number: { type: Number, required: false },
  location: { type: String, required: false },
  assigned_vehicle: {
    type: Schema.Types.ObjectId,
    ref: "Vehicle",
    required: false,
  },
  working_hours: { type: [WorkingHoursSchema], required: false },
  assignments: { type: [AssignmentSchema], required: false },
  assignment_requests: { type: [AssignmentSchema], required: false },
});

const Driver: Model<IDriver> =
  models?.Driver || model<IDriver>("Driver", DriverSchema);

export default Driver;
