import axios from "axios";
import api from "./api";

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  role: "CUSTOMER" | "ADMIN";
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

export async function getMyProfile(): Promise<CustomerProfile> {
  try {
    const response = await api.get<CustomerProfile>(
      "/customer/me"
    );

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function updateMyProfile(
  profile: CustomerProfile
): Promise<CustomerProfile> {
  try {
    const response = await api.put<CustomerProfile>(
      "/customer/me",
      {
        name: profile.name,
        phone: profile.phone,
        companyName: profile.companyName,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export interface CustomerQuote {
  id: string;
  customerName: string;
  email: string;
  origin: string;
  destination: string;
  cargo: string;
  weight: string;
  containerSize: string;
  requestedVehicle: string;
  amount: number | string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";
  requestedAt: string;
  expiresAt: string;
}

export async function createCustomerQuote(payload: {
  origin: string;
  destination: string;
  cargo: string;
  weight: string;
  containerSize: string;
  requestedVehicle: string;
  amount: string;
}): Promise<CustomerQuote> {
  try {
    const response = await api.post<CustomerQuote>("/customer/quotes", payload);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getMyQuotes(): Promise<CustomerQuote[]> {
  try {
    const response = await api.get<CustomerQuote[]>("/customer/quotes");
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getQuoteById(referenceCode: string): Promise<CustomerQuote> {
  try {
    const response = await api.get<CustomerQuote>(`/customer/quotes/${referenceCode}`);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function acceptQuote(referenceCode: string): Promise<{
  bookingId: string;
  quoteId: string;
  route: string;
  vehicle: string;
  amount: number | string;
  status: string;
  bookingDate: string;
}> {
  try {
    const response = await api.post<{
      bookingId: string;
      quoteId: string;
      route: string;
      vehicle: string;
      amount: number | string;
      status: string;
      bookingDate: string;
    }>(`/customer/quotes/${referenceCode}/accept`);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function createCustomerPayment(payload: {
  bookingCode: string;
  method: "UPI" | "CARD" | "NET_BANKING";
  transactionReference: string;
  status?: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
}): Promise<{
  id: string;
  bookingCode: string;
  quoteId: string;
  customer: string;
  email: string;
  amount: number | string;
  method: string;
  transactionReference: string;
  status: string;
  paymentDate: string;
}> {
  try {
    const response = await api.post<{
      id: string;
      bookingCode: string;
      quoteId: string;
      customer: string;
      email: string;
      amount: number | string;
      method: string;
      transactionReference: string;
      status: string;
      paymentDate: string;
    }>('/customer/payments', payload);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export interface CustomerShipment {
  id: string;
  bookingId: string;
  customer: string;
  origin: string;
  destination: string;
  vehicle: string;
  shipmentDate: string;
  estimatedDelivery: string;
  status: "PENDING" | "ASSIGNED" | "IN_TRANSIT" | "DELIVERED" | "COMPLETED";
  trackingHistory?: Array<{
    status: string;
    timestamp: string;
    message: string;
  }>;
}

export async function getMyShipments(): Promise<CustomerShipment[]> {
  try {
    const response = await api.get<CustomerShipment[]>('/customer/shipments');
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getShipmentById(trackingCode: string): Promise<CustomerShipment> {
  try {
    const response = await api.get<CustomerShipment>(`/customer/shipments/${trackingCode}`);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}