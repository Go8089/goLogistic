import { Check, Clock3, MapPin, Search, Truck } from "lucide-react";
import { useState } from "react";

import { getShipmentById, type CustomerShipment } from "../../services/customerService";

const trackingSteps = [
  { key: "PENDING", title: "Booked" },
  { key: "ASSIGNED", title: "Assigned" },
  { key: "IN_TRANSIT", title: "In Transit" },
  { key: "DELIVERED", title: "Delivered" },
];

function getTimeline(status: string) {
  const normalized = status.toUpperCase();
  const stepIndex = trackingSteps.findIndex((step) => step.key === normalized);
  const currentIndex = stepIndex >= 0 ? stepIndex : 0;

  return trackingSteps.map((step, index) => ({
    ...step,
    completed: index <= currentIndex,
    current: index === currentIndex,
    last: index === trackingSteps.length - 1,
  }));
}

function formatDate(value?: string) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function Tracking() {
  const [trackingId, setTrackingId] = useState("");
  const [shipment, setShipment] = useState<CustomerShipment | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSearch() {
    const normalizedId = trackingId.trim();

    if (!normalizedId) {
      setShipment(null);
      setNotFound(false);
      return;
    }

    setIsLoading(true);
    setNotFound(false);

    try {
      const result = await getShipmentById(normalizedId);
      setShipment(result);
    } catch (_error) {
      setShipment(null);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div>
        <p className="text-sm font-medium text-blue-600">Shipment Tracking</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Track Shipment</h1>
        <p className="mt-2 text-sm text-gray-500">Enter your tracking ID to view the latest shipment status.</p>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={trackingId}
              onChange={(event) => setTrackingId(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  void handleSearch();
                }
              }}
              placeholder="Enter tracking ID"
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="button"
            onClick={() => void handleSearch()}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Track Shipment"}
          </button>
        </div>
      </div>

      {shipment && (
        <div className="mt-6 space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Tracking ID</p>
                <h2 className="mt-1 text-xl font-bold text-gray-900">{shipment.id}</h2>
              </div>
              <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">{shipment.status}</span>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Info label="Origin" value={shipment.origin} />
              <Info label="Destination" value={shipment.destination} />
              <Info label="Vehicle" value={shipment.vehicle} />
              <Info label="Estimated Delivery" value={formatDate(shipment.estimatedDelivery)} />
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-blue-600" />
              <h2 className="font-semibold text-gray-900">Current Route</h2>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <Info label="Origin" value={shipment.origin} />
              <Truck size={20} className="hidden text-blue-600 sm:block" />
              <Info label="Destination" value={shipment.destination} />
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
            <div className="flex items-center gap-2">
              <Clock3 size={18} className="text-blue-600" />
              <h2 className="font-semibold text-gray-900">Tracking Progress</h2>
            </div>
            <div className="mt-7">
              {getTimeline(shipment.status).map((step) => (
                <Step
                  key={step.key}
                  title={step.title}
                  completed={step.completed}
                  current={step.current}
                  last={step.last}
                />
              ))}
            </div>
          </section>
        </div>
      )}

      {!shipment && trackingId === "" && !isLoading && (
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">Enter a tracking ID to begin tracking.</p>
        </div>
      )}

      {!shipment && trackingId !== "" && !isLoading && notFound && (
        <div className="mt-10 rounded-xl border border-gray-200 bg-white px-5 py-12 text-center">
          <p className="text-sm font-semibold text-gray-900">Shipment not found</p>
          <p className="mt-1 text-sm text-gray-500">No shipment matches that tracking ID yet.</p>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}

function Step({ title, completed = false, current = false, last = false }: { title: string; completed?: boolean; current?: boolean; last?: boolean }) {
  return (
    <div className="flex gap-3 pb-5 last:pb-0">
      <div className="flex flex-col items-center">
        <div className={`h-4 w-4 rounded-full border-2 ${completed ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"}`} />
        {!last && <div className={`mt-2 h-full w-px ${completed ? "bg-blue-200" : "bg-gray-200"}`} />}
      </div>
      <div className="flex-1 pt-0.5">
        <p className={`text-sm font-medium ${current ? "text-blue-700" : "text-gray-700"}`}>{title}</p>
      </div>
      {completed && <Check size={16} className="text-blue-600" />}
    </div>
  );
}
