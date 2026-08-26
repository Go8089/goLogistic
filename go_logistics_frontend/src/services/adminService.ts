import axios from "axios";
import api from "./api";

export interface DashboardStat {
  label: string;
  value: number | string;
}

export interface DashboardResponse {
  stats: DashboardStat[];
  recentQuotes: Array<{
    id: string;
    customer: string;
    route?: string;
    amount?: string;
    status?: string;
    origin?: string;
    destination?: string;
    requestedDate?: string;
    requestedVehicle?: string;
    email?: string;
    cargo?: string;
    weight?: string;
    containerSize?: string;
  }>;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  shipments: number;
  joinedDate: string;
  status: "Active" | "Inactive";
}

export interface AdminBooking {
  id: string;
  customer: string;
  route: string;
  vehicle: string;
  bookingDate: string;
  amount: string;
  status:
    | "Created"
    | "Payment Pending"
    | "Confirmed"
    | "Assigned"
    | "In Transit"
    | "Delivered"
    | "Completed"
    | "Cancelled";
}

export interface AdminShipment {
  id: string;
  bookingId: string;
  customer: string;
  origin: string;
  destination: string;
  vehicle: string;
  shipmentDate: string;
  estimatedDelivery: string;
  status: "Pending" | "Assigned" | "In Transit" | "Delivered" | "Completed";
}

export interface AdminVehicle {
  id: string;
  registrationNumber: string;
  vehicleType: string;
  containerSize: string;
  capacity: string;
  driver: string;
  status: "Available" | "Assigned" | "Maintenance";
}

export interface AdminPayment {
  id: string;
  quoteId: string;
  customer: string;
  email: string;
  amount: number;
  method: string;
  date: string;
  status: "Success" | "Pending" | "Failed" | "Refunded" | "Paid";
  transactionReference?: string;
}

export interface AdminQuoteDetail {
  id: string;
  customer: string;
  email: string;
  origin: string;
  destination: string;
  cargo: string;
  weight: string;
  containerSize: string;
  requestedDate: string;
  requestedVehicle: string;
  amount: string;
  status: "Pending" | "Approved" | "Rejected" | "Expired";
}

function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as
      | { message?: string; error?: string }
      | undefined;

    return payload?.message || payload?.error || "Request failed";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Request failed";
}

export async function getAdminDashboard(): Promise<DashboardResponse> {
  try {
    const response = await api.get<DashboardResponse>("/admin/dashboard");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getAdminQuotes() {
  try {
    const response = await api.get("/admin/quotes");
    return response.data as Array<{
      id: string;
      customer: string;
      email: string;
      origin: string;
      destination: string;
      cargo: string;
      weight: string;
      containerSize: string;
      requestedDate: string;
      requestedVehicle: string;
      amount: string;
      status: "Pending" | "Approved" | "Rejected" | "Expired";
    }>;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getAdminQuoteById(id: string): Promise<AdminQuoteDetail> {
  try {
    const response = await api.get<AdminQuoteDetail>(`/admin/quotes/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function updateAdminQuoteStatus(
  id: string,
  payload: { status: "Pending" | "Approved" | "Rejected" | "Expired"; amount?: string }
): Promise<AdminQuoteDetail> {
  try {
    const response = await api.patch<AdminQuoteDetail>(`/admin/quotes/${id}/status`, payload);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function updateAdminCustomerStatus(
  id: string,
  status: "Active" | "Inactive"
): Promise<{ id: string; status: string; enabled: boolean }> {
  try {
    const response = await api.patch<{ id: string; status: string; enabled: boolean }>(`/admin/customers/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  try {
    const response = await api.get<AdminCustomer[]>("/admin/customers");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getAdminBookings(): Promise<AdminBooking[]> {
  try {
    const response = await api.get<AdminBooking[]>("/admin/bookings");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getAdminShipments(): Promise<AdminShipment[]> {
  try {
    const response = await api.get<AdminShipment[]>("/admin/shipments");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getAdminVehicles(): Promise<AdminVehicle[]> {
  try {
    const response = await api.get<AdminVehicle[]>("/admin/vehicles");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getAdminPayments(): Promise<AdminPayment[]> {
  try {
    const response = await api.get<AdminPayment[]>("/admin/payments");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
