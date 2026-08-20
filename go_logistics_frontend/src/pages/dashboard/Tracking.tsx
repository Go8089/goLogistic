import {
  Check,
  Clock3,
  MapPin,
  Search,
  Truck,
} from "lucide-react";
import { useState } from "react";

const trackingData = {
  TRK10001: {
    id: "TRK10001",
    origin: "Pune, Maharashtra",
    destination: "Mumbai, Maharashtra",
    status: "In Transit",
    vehicle: "Truck - MH12 AB 1234",
    containerSize: "32 ft",
    currentLocation: "Lonavala, Maharashtra",
    estimatedDelivery: "Aug 22, 2026",
  },
};

export default function Tracking() {
  const [trackingId, setTrackingId] = useState("");
  const [shipment, setShipment] = useState<
    (typeof trackingData)[keyof typeof trackingData] | null
  >(null);

  function handleSearch() {
    const result =
      trackingData[
        trackingId.trim().toUpperCase() as keyof typeof trackingData
      ];

    setShipment(result ?? null);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div>
        <p className="text-sm font-medium text-blue-600">
          Shipment Tracking
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Track Shipment
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter your tracking ID to view the latest shipment status.
        </p>
      </div>

      {/* Search */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={trackingId}
              onChange={(event) =>
                setTrackingId(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="Enter tracking ID e.g. TRK10001"
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Track Shipment
          </button>
        </div>
      </div>

      {/* Result */}
      {shipment && (
        <div className="mt-6 space-y-6">
          {/* Summary */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Tracking ID
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900">
                  {shipment.id}
                </h2>
              </div>

              <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                {shipment.status}
              </span>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Info
                label="Current Location"
                value={shipment.currentLocation}
              />

              <Info
                label="Estimated Delivery"
                value={shipment.estimatedDelivery}
              />

              <Info
                label="Vehicle"
                value={shipment.vehicle}
              />

              <Info
                label="Container Size"
                value={shipment.containerSize}
              />
            </div>
          </section>

          {/* Route */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-blue-600" />

              <h2 className="font-semibold text-gray-900">
                Current Route
              </h2>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <Info
                label="Origin"
                value={shipment.origin}
              />

              <Truck
                size={20}
                className="hidden text-blue-600 sm:block"
              />

              <Info
                label="Destination"
                value={shipment.destination}
              />
            </div>
          </section>

          {/* Status */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
            <div className="flex items-center gap-2">
              <Clock3 size={18} className="text-blue-600" />

              <h2 className="font-semibold text-gray-900">
                Tracking Progress
              </h2>
            </div>

            <div className="mt-7">
              <Step
                title="Shipment Booked"
                completed
              />

              <Step
                title="Picked Up"
                completed
              />

              <Step
                title="In Transit"
                completed
                current
              />

              <Step
                title="Out for Delivery"
              />

              <Step
                title="Delivered"
                last
              />
            </div>
          </section>
        </div>
      )}

      {/* Initial state */}
      {!shipment && trackingId === "" && (
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            Enter a tracking ID to begin tracking.
          </p>

          <p className="mt-2 text-xs text-gray-400">
            Try TRK10001
          </p>
        </div>
      )}

      {/* Not found */}
      {!shipment && trackingId !== "" && (
        <div className="mt-10 rounded-xl border border-gray-200 bg-white px-5 py-12 text-center">
          <p className="text-sm font-semibold text-gray-900">
            Shipment not found
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Please check the tracking ID and try again.
          </p>
        </div>
      )}
    </div>
  );
}

function Info({
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

      <p className="mt-1 text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}

function Step({
  title,
  completed = false,
  current = false,
  last = false,
}: {
  title: string;
  completed?: boolean;
  current?: boolean;
  last?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            completed
              ? "bg-blue-600 text-white"
              : "border border-gray-300 bg-white text-gray-400"
          }`}
        >
          {completed ? (
            <Check size={15} />
          ) : (
            <span className="h-2 w-2 rounded-full bg-gray-300" />
          )}
        </div>

        {!last && (
          <div className="h-10 w-px bg-gray-200" />
        )}
      </div>

      <div className="pb-6">
        <p
          className={`text-sm font-semibold ${
            current
              ? "text-blue-600"
              : completed
                ? "text-gray-900"
                : "text-gray-400"
          }`}
        >
          {title}
        </p>

        {current && (
          <p className="mt-1 text-xs text-gray-500">
            Shipment is currently at this stage.
          </p>
        )}
      </div>
    </div>
  );
}