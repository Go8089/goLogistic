import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Truck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function BookingConfirmation() {
  const { id } = useParams();

  const quoteId = id || "QT10001";

  // Mock data for now.
  // Later this will come from the backend.
  const booking = {
    bookingId: "BK10001",
    quoteId,
    pickupLocation: "Pune, Maharashtra",
    deliveryLocation: "Mumbai, Maharashtra",
    cargoType: "Commercial Goods",
    weight: "850 kg",
    vehicleCategory: "Heavy Truck",
    bodyType: "Container",
    containerSize: "32 ft",
    pickupDate: "25 Aug 2026",
    totalAmount: "₹18,500",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      {/* Back */}
      <Link
        to={`/dashboard/quotes/${quoteId}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back to Quote
      </Link>

      {/* Success */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 text-center sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <CheckCircle2 size={28} />
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Booking Confirmed
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Your transportation booking has been successfully
          created.
        </p>

        <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2">
          <span className="text-xs text-gray-500">
            Booking ID
          </span>

          <span className="text-sm font-bold text-gray-900">
            {booking.bookingId}
          </span>
        </div>
      </div>

      {/* Route */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Transportation Route
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your confirmed pickup and delivery locations.
            </p>
          </div>

          <MapPin
            size={21}
            className="text-gray-400"
          />
        </div>

        <div className="mt-7 grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <Location
            label="Pickup"
            location={booking.pickupLocation}
          />

          <div className="hidden h-px w-16 bg-gray-200 sm:block" />

          <Location
            label="Delivery"
            location={booking.deliveryLocation}
          />
        </div>
      </section>

      {/* Booking details */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Booking Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Confirmed transportation requirements.
            </p>
          </div>

          <Truck
            size={21}
            className="text-gray-400"
          />
        </div>

        <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          <Detail
            label="Cargo Type"
            value={booking.cargoType}
          />

          <Detail
            label="Weight"
            value={booking.weight}
          />

          <Detail
            label="Vehicle Category"
            value={booking.vehicleCategory}
          />

          <Detail
            label="Body / Container Type"
            value={booking.bodyType}
          />

          <Detail
            label="Container / Body Size"
            value={booking.containerSize}
          />

          <Detail
            label="Pickup Date"
            value={booking.pickupDate}
          />
        </div>
      </section>

      {/* Amount */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Total Transportation Amount
          </span>

          <span className="text-xl font-bold text-gray-900">
            {booking.totalAmount}
          </span>
        </div>

        <p className="mt-3 text-xs leading-5 text-gray-400">
          Payment details will be available according to your
          company's payment terms.
        </p>
      </section>

      {/* Status */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
        <div className="flex items-start gap-3">
          <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />

          <div>
            <p className="text-sm font-semibold text-gray-900">
              Booking confirmed
            </p>

            <p className="mt-1 text-sm leading-6 text-gray-500">
              Our transportation team will assign a suitable
              vehicle and driver for your shipment.
            </p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Link
          to="/dashboard/shipments"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          View My Shipments
        </Link>

        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

function Location({
  label,
  location,
}: {
  label: string;
  location: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-base font-semibold text-gray-900">
        {location}
      </p>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}