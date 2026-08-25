import { useEffect, useState } from "react";
import { CheckCircle2, UserRound } from "lucide-react";
import { getMyProfile, updateMyProfile } from "../../services/customerService";
import type { CustomerProfile } from "../../services/customerService";


export default function Profile() {
 const [profile, setProfile] = useState<CustomerProfile | null>(null);
 const [saved, setSaved] = useState(false);
 const [error, setError] = useState("");
 const [isLoading, setIsLoading] = useState(true);

 const handleChange = (
   event: React.ChangeEvent<HTMLInputElement>
 ) => {
   const { name, value } = event.target;

   setProfile((previous) => {
     if (!previous) return previous;

     return {
       ...previous,
       [name]: value,
     };
   });

   setSaved(false);
   setError("");
 };

 const handleSubmit = async (
   event: React.FormEvent<HTMLFormElement>
 ) => {
   event.preventDefault();

   if (!profile) return;

   try {
     setError("");
     const updatedProfile = await updateMyProfile(profile);
     setProfile(updatedProfile);
     setSaved(true);

     setTimeout(() => {
       setSaved(false);
     }, 3000);
   } catch (error) {
     setError(
       error instanceof Error
         ? error.message
         : "Unable to update profile."
     );
   }
 };

 useEffect(() => {
   async function loadProfile() {
     try {
       setError("");
       const data = await getMyProfile();
       setProfile(data);
     } catch (error) {
       setError(
         error instanceof Error
           ? error.message
           : "Failed to load profile."
       );
     } finally {
       setIsLoading(false);
     }
   }

   loadProfile();
 }, []);

 if (isLoading || !profile) {
   return (
     <div className="mx-auto max-w-5xl px-4 py-8">
       <p className="text-sm text-gray-500">
         {isLoading ? "Loading profile..." : "Profile unavailable."}
       </p>
     </div>
   );
 }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Heading */}
      <div>
        <p className="text-sm font-medium text-blue-600">
          Account
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Profile
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage your personal and company information.
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Profile header */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <UserRound size={25} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900">
              {profile.name}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {profile.email}
            </p>
          </div>
        </div>
      </section>

    {saved && (
  <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
    Profile updated successfully.
  </div>
   )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-xl border border-gray-200 bg-white"
      >
        {/* Personal */}
        <div className="border-b border-gray-200 p-5 sm:p-7">
          <h2 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your basic contact information.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field
              label="Full Name"
              name="name"
              value={profile.name}
              onChange={handleChange}
            />

            <Field
              label="Email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              readonly
            />

            <Field
              label="Phone Number"
              name="phone"
              type="tel"
              value={profile.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Address */}
        <div className="p-5 sm:p-7">
          <h2 className="text-lg font-semibold text-gray-900">
            Address
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your primary business address.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field
                label="Address"
                name="address"
                value={profile.address}
                onChange={handleChange}
              />
            </div>

            <Field
              label="City"
              name="city"
              value={profile.city}
              onChange={handleChange}
            />

            <Field
              label="State"
              name="state"
              value={profile.state}
              onChange={handleChange}
            />

            <Field
              label="PIN Code"
              name="pincode"
              value={profile.pincode}
              onChange={handleChange}
            />

            <Field
             label="Company Name"
             name="companyName"
             value={profile.companyName}
             onChange={handleChange}
            />
          </div>

          {/* Save */}
          <div className="mt-7 flex flex-col items-stretch gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-end">
            {saved && (
              <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                <CheckCircle2 size={17} />
                Changes saved
              </div>
            )}

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  readonly = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  type?: string;
  readonly?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        readOnly={readonly}
        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}