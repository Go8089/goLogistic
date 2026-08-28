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

// Error message extractor - Single Responsibility
class ApiErrorExtractor {
  static extract(error: unknown): string {
    if (axios.isAxiosError(error)) {
      const payload = error.response?.data as
        | { message?: string; error?: string; detail?: string }
        | undefined;

      return (
        payload?.message ||
        payload?.error ||
        payload?.detail ||
        error.message ||
        "Request failed"
      );
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "An unexpected error occurred";
  }
}

// Auth service - handles authentication logic
export const authService = {
  async login(
    email: string,
    password: string
  ): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email: email.trim(),
        password,
      });

      return response.data;
    } catch (error) {
      throw new Error(ApiErrorExtractor.extract(error));
    }
  },

  async sendRegistrationOtp(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    otpChannel: OtpChannel;
  }): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(
        "/auth/register/send-otp",
        {
          ...data,
          email: data.email.trim(),
          phone: data.phone.trim(),
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(ApiErrorExtractor.extract(error));
    }
  },

  async register(data: RegisterRequest): Promise<{ message: string }> {
    try {
      const response = await api.post("/auth/register", {
        ...data,
        email: data.email.trim(),
        phone: data.phone.trim(),
      });
      return response.data;
    } catch (error) {
      throw new Error(ApiErrorExtractor.extract(error));
    }
  },

  async requestPasswordReset(
    contact: string,
    channel: OtpChannel
  ): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(
        "/auth/forgot-password",
        {
          contact: contact.trim(),
          channel,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(ApiErrorExtractor.extract(error));
    }
  },

  async verifyResetOtp(
    contact: string,
    otp: string,
    channel: OtpChannel
  ): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(
        "/auth/verify-reset-otp",
        {
          contact: contact.trim(),
          channel,
          otp: otp.trim(),
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(ApiErrorExtractor.extract(error));
    }
  },

  async resetPassword(
    contact: string,
    otp: string,
    password: string,
    channel: OtpChannel
  ): Promise<{ message: string }> {
    try {
      const response = await api.post<{ message: string }>(
        "/auth/reset-password",
        {
          contact: contact.trim(),
          otp: otp.trim(),
          password,
          channel,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(ApiErrorExtractor.extract(error));
    }
  },

  async adminLogin(
    email: string,
    password: string
  ): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>("/auth/admin/login", {
        email: email.trim(),
        password,
      });

      if (response.data.role !== "ADMIN") {
        throw new Error("Admin access required");
      }

      return response.data;
    } catch (error) {
      throw new Error(ApiErrorExtractor.extract(error));
    }
  },
};

// For backward compatibility
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  return authService.login(email, password);
}

export async function sendRegistrationOtp(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  otpChannel: OtpChannel;
}) {
  return authService.sendRegistrationOtp(data);
}

export async function register(data: RegisterRequest) {
  return authService.register(data);
}

export async function requestPasswordReset(
  contact: string,
  channel: OtpChannel
): Promise<{ message: string }> {
  return authService.requestPasswordReset(contact, channel);
}

export async function verifyResetOtp(
  contact: string,
  otp: string,
  channel: OtpChannel
): Promise<{ message: string }> {
  return authService.verifyResetOtp(contact, otp, channel);
}

export async function resetPassword(
  contact: string,
  otp: string,
  password: string,
  channel: OtpChannel
): Promise<{ message: string }> {
  return authService.resetPassword(contact, otp, password, channel);
}

export async function adminLogin(
  email: string,
  password: string
): Promise<LoginResponse> {
  return authService.adminLogin(email, password);
}
