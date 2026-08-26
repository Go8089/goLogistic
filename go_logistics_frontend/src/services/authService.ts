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

<<<<<<< HEAD
=======
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

>>>>>>> agents/help-me-fix-describe-the-bug-in-this
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
<<<<<<< HEAD

  return response.data;
}

export async function verifyEmail(
  email: string,
  otp: string
) {
  const response = await api.post(
    "/auth/customer/verify-email",
    {
      email,
      otp,
    }
  );

  return response.data;
}
export async function resendEmailOtp(
  email: string
) {
  const response = await api.post(
    "/auth/customer/resend-email-otp",
    { email }
  );

  return response.data;
}
export async function verifyPhone(
  phone: string,
  otp: string
) {
  const response = await api.post(
    "/auth/customer/verify-phone",
    {
      phone,
      otp,
    }
  );

  return response.data;
}

export async function forgotPassword(email: string) {
  const response = await api.post(
    "/auth/customer/forgot-password",
    { email }
  );

  return response.data;
}

export async function verifyResetOtp(
  email: string,
  otp: string
) {
  const response = await api.post(
    "/auth/customer/verify-reset-otp",
    {
      email,
      otp,
    }
  );

  return response.data;
}

export async function resetPassword(
  resetToken: string,
  newPassword: string
) {
  const response = await api.post(
    "/auth/customer/reset-password",
    {
      resetToken,
      newPassword,
    }
  );

  return response.data;
}
=======
}
>>>>>>> agents/help-me-fix-describe-the-bug-in-this
