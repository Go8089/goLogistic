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