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

export async function getMyProfile(): Promise<CustomerProfile> {
  const response = await api.get<CustomerProfile>(
    "/customer/me"
  );

  return response.data;
}

export async function updateMyProfile(
  profile: CustomerProfile
): Promise<CustomerProfile> {
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
}