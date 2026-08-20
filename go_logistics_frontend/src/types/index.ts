import type { LucideIcon } from "lucide-react";

export interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
}

export interface FleetVehicle {
  name: string;
  capacity: string;
  type: string;
  description: string;
  image: string;
  features: string[];
}

export interface QuoteRequest {
  pickupLocation: string;
  deliveryLocation: string;
  pickupDate: string;
  deliveryDate: string;
  cargoType: string;
  cargoWeight: string;
  packageCount: number;
  vehicleType: string;
  cargoDescription: string;
  fullName: string;
  companyName: string;
  phone: string;
  email: string;
}