export type UserRole = "admin" | "owner" | "user";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Booking {
  _id: string;
  userId: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  userName?: string;
}

export interface AuthFormState {
  name: string;
  password?: string;
}

export interface BookingFormState {
  startTime: string;
  endTime: string;
}

export interface UserFormState {
  name: string;
  password?: string;
  role: UserRole;
}

export interface SummaryItem {
  userId: string;
  name: string;
  role: UserRole;
  totalBookings: number;
}

export interface GroupedBookings {
  userId: string;
  name: string;
  role: UserRole;
  bookings: Booking[];
}