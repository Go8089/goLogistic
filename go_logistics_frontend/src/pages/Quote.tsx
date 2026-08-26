import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

import { createCustomerQuote } from "../services/customerService";

interface QuoteForm {
  pickupLocation: string;
  deliveryLocation: string;
  cargoType: string;
  weight: string;
  vehicleCategory: string;
  bodyType: string;
  containerSize: string;
  pickupDate: string;
  notes: string;
}

const initialForm: QuoteForm = {
  pickupLocation: "",
  deliveryLocation: "",
  cargoType: "",
  weight: "",
  vehicleCategory: "",
  bodyType: "",
  containerSize: "",
  pickupDate: "",
  notes: "",
};

const vehicleOptions: Record<
  string,
  string[]
> = {
  "Mini Truck": ["8 ft", "10 ft"],
  "Pickup Truck": ["8 ft", "10 ft", "12 ft"],
  LCV: ["14 ft", "17 ft"],
  "Medium Truck": ["17 ft", "20 ft", "22 ft"],
  "Heavy Truck": ["22 ft", "24 ft", "32 ft"],
  Trailer: ["20 ft", "24 ft", "32 ft", "40 ft"],
};

const bodyTypes = [
  "Open Body",
  "Closed Body",
  "Container",
  "Flatbed",
  "Refrigerated",
];

export default function Quote() {
  const [form, setForm] =
    useState<QuoteForm>(initialForm);

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const syncAuthState = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("token")));
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);

    return () => window.removeEventListener("storage", syncAuthState);
  }, []);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => {
      const updated = {
        ...previous,
        [name]: value,
      };

      // Reset dependent fields when vehicle changes.
      if (name === "vehicleCategory") {
        updated.containerSize = "";
        updated.bodyType = "";
      }

      return updated;
    });
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await createCustomerQuote({
        origin: form.pickupLocation,
        destination: form.deliveryLocation,
        cargo: form.cargoType,
        weight: form.weight,
        containerSize: form.containerSize,
        requestedVehicle: form.vehicleCategory,
        amount: "0",
      });
      setSubmitted(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to submit quote request right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return <QuoteSuccess />;
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-amber-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <ShieldAlert size={28} />
            </div>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Login required to request a quote
            </h1>

            <p className="mt-4 text-base leading-7 text-gray-600">
              Registration and login are required to request pricing, book cargo transport,
              and manage your logistics account with GoLogistic.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Customer Login
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const availableSizes =
    vehicleOptions[form.vehicleCategory] ?? [];

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="mt-6 max-w-2xl">
            <p className="text-sm font-medium text-blue-600">
              Road Transportation
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Request a Quote
            </h1>

            <p className="mt-3 text-sm leading-6 text-gray-500 sm:text-base">
              Tell us about your transportation requirement.
              We'll review your request and provide a quote.
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-200 bg-white"
        >
          {/* Route */}
          <div className="border-b border-gray-200 p-5 sm:p-7">
            <h2 className="text-lg font-semibold text-gray-900">
              Transportation Route
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Where should we pick up and deliver your cargo?
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Field
                label="Pickup Location"
                name="pickupLocation"
                value={form.pickupLocation}
                onChange={handleChange}
                placeholder="e.g. Pune, Maharashtra"
                required
              />

              <Field
                label="Delivery Location"
                name="deliveryLocation"
                value={form.deliveryLocation}
                onChange={handleChange}
                placeholder="e.g. Mumbai, Maharashtra"
                required
              />
            </div>
          </div>

          {/* Cargo */}
          <div className="border-b border-gray-200 p-5 sm:p-7">
            <h2 className="text-lg font-semibold text-gray-900">
              Cargo Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Provide information about the goods you want to
              transport.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <SelectField
                label="Cargo Type"
                name="cargoType"
                value={form.cargoType}
                onChange={handleChange}
                required
                options={[
                  "General Cargo",
                  "Commercial Goods",
                  "Industrial Equipment",
                  "Machinery",
                  "Construction Material",
                  "Other",
                ]}
              />

              <Field
                label="Approximate Weight"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="e.g. 850 kg"
                required
              />
            </div>
          </div>

          {/* Vehicle */}
          <div className="border-b border-gray-200 p-5 sm:p-7">
            <h2 className="text-lg font-semibold text-gray-900">
              Vehicle Requirement
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select the road vehicle and required body/container
              size.
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {/* Vehicle category */}
              <SelectField
                label="Vehicle Category"
                name="vehicleCategory"
                value={form.vehicleCategory}
                onChange={handleChange}
                required
                options={Object.keys(vehicleOptions)}
              />

              {/* Body type */}
              <SelectField
                label="Body / Container Type"
                name="bodyType"
                value={form.bodyType}
                onChange={handleChange}
                required
                disabled={!form.vehicleCategory}
                options={bodyTypes}
              />

              {/* Container size */}
              <SelectField
                label="Container / Body Size"
                name="containerSize"
                value={form.containerSize}
                onChange={handleChange}
                required
                disabled={!form.vehicleCategory}
                options={availableSizes}
              />

              {/* Pickup date */}
              <Field
                label="Preferred Pickup Date"
                name="pickupDate"
                type="date"
                value={form.pickupDate}
                onChange={handleChange}
                required
              />
            </div>

            {!form.vehicleCategory && (
              <p className="mt-4 text-xs text-gray-400">
                Select a vehicle category to see available sizes.
              </p>
            )}
          </div>

          {/* Additional information */}
          <div className="p-5 sm:p-7">
            <h2 className="text-lg font-semibold text-gray-900">
              Additional Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add any special instructions or requirements.
            </p>

            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={5}
              placeholder="Tell us anything else we should know..."
              className="mt-6 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />

            {error && (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {/* Buttons */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {isSubmitting ? "Submitting..." : "Submit Quote Request"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-blue-600">*</span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => void;
  options: string[];
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-blue-600">*</span>
        )}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
      >
        <option value="">
          Select {label}
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function QuoteSuccess() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4 py-12">
      <div className="w-full rounded-xl border border-gray-200 bg-white p-8 text-center sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <CheckCircle2 size={28} />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-gray-900">
          Quote Request Submitted
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
          Thank you for your request. Our transportation team
          will review the details and contact you with the quote.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/dashboard/quotes"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            View My Quotes
          </Link>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}