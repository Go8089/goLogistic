import api from "./api";

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
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    {
      email,
      password,
    }
  );

  return response.data;
}

export async function register(
  data: RegisterRequest
) {
  const response = await api.post(
    "/auth/register",
    data
  );

  return response.data;
}

export async function adminLogin(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/auth/admin/login",
    {
      email,
      password,
    }
  );

  if (response.data.role !== "ADMIN") {
    throw new Error("Admin access required");
  }

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