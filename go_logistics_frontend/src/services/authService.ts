import api from "./api";
import axios from "axios";

export type OtpChannel = "EMAIL" | "PHONE";

export interface LoginResponse {
  token: string;
  userId: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  otpChannel: OtpChannel;
  otp: string;
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

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function sendRegistrationOtp(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  otpChannel: OtpChannel;
}) {
  try {
    const response = await api.post<{ message: string }>("/auth/register/send-otp", data);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function register(data: RegisterRequest) {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function requestPasswordReset(
  contact: string,
  channel: OtpChannel
): Promise<{ message: string }> {
  try {
    const response = await api.post<{ message: string }>("/auth/forgot-password", {
      contact,
      channel,
    });

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function verifyResetOtp(
  contact: string,
  otp: string,
  channel: OtpChannel
): Promise<{ message: string }> {
  try {
    const response = await api.post<{ message: string }>("/auth/verify-reset-otp", {
      contact,
      channel,
      otp,
    });

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function resetPassword(
  contact: string,
  otp: string,
  password: string,
  channel: OtpChannel
): Promise<{ message: string }> {
  try {
    const response = await api.post<{ message: string }>("/auth/reset-password", {
      contact,
      otp,
      password,
      channel,
    });

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function adminLogin(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>("/auth/admin/login", {
      email,
      password,
    });

    if (response.data.role !== "ADMIN") {
      throw new Error("Admin access required");
    }

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
