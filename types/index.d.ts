export interface IWorkingHours {
  day: string;
  start: Date;
  end: Date;
}
interface WorkingHour {
  day: string;
  start: string;
  end: string;
  _id: string;
}

export interface Vehicle {
  _id: string;
  brand: string;
  model_name: string;
  licensePlate: string;
  fuel: string;
  available: boolean;
  transmission: string;
  __v: number;
}

export interface Assignment {
  vehicle: Vehicle;
  start_time: string;
  end_time: string;
  _id: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone_number: number;
  working_hours: WorkingHour[];
  __v: number;
  location: string;
  assigned_vehicle: string;
  assignments: Assignment[];
}
export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
export interface WorkingHour {
  day?: DayOfWeek;
  start?: Date;
  end?: Date;
}
export interface UserDetails {
  name: string;
  phone_number: number;
  location: string;
  email: string;
  working_hours?: WorkingHour[];
}
