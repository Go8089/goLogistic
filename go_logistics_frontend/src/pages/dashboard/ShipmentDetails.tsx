import { ArrowLeft, Check, Clock3, MapPin, Package, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getShipmentById, type CustomerShipment } from "../../services/customerService";

const trackingDefinitions = [
  { status: "PENDING", title: "Booked", description: "Shipment request has been confirmed." },
  { status: "ASSIGNED", title: "Assigned", description: "The vehicle has been assigned." },
  { status: "IN_TRANSIT", title: "In Transit", description: "Shipment is moving toward the destination." },
  { status: "DELIVERED", title: "Delivered", description: "Shipment has been delivered successfully." },
];

function buildTimeline(shipment: CustomerShipment) {
  const normalized = shipment.status.toUpperCase();
  const currentIndex = trackingDefinitions.findIndex((step) => step.status === normalized);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;

  return trackingDefinitions.map((step, index) => ({
    ...step,
    completed: index <= safeIndex,
    current: index === safeIndex,
    last: index === trackingDefinitions.length - 1,
  }));
}

export default function ShipmentDetails() {
  const { id } = useParams();
  const [shipment, setShipment] = useState<CustomerShipment | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    getShipmentById(id)
      .then((data) => setShipment(data))
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : "Unable to load shipment details");
      });
  }, [id]);

  if (!shipment) {
    return <ShipmentNotFound message={error || undefined} />;
  }

  const timeline = buildTimeline(shipment);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Link
        to="/dashboard/shipments"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back to Shipments
      </Link>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Shipment Details</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{shipment.id}</h1>
          <p className="mt-2 text-sm text-gray-500">Shipment from {shipment.origin} to {shipment.destination}</p>
        </div>

        <StatusBadge status={shipment.status} />
      </div>

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-blue-600" />
          <h2 className="font-semibold text-gray-900">Shipment Route</h2>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <Location label="Origin" location={shipment.origin} />
          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              <div className="h-px w-16 bg-gray-300 lg:w-28" />
              <Truck size={20} className="text-blue-600" />
              <div className="h-px w-16 bg-gray-300 lg:w-28" />
            </div>
          </div>
          <Location label="Destination" location={shipment.destination} />
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Clock3 size={18} className="text-blue-600" />
            <h2 className="font-semibold text-gray-900">Shipment Progress</h2>
          </div>

          <div className="mt-6">
            {timeline.map((item, index) => (
              <TimelineItem
                key={item.title}
                title={item.title}
                description={item.description}
                completed={item.completed}
                current={item.current}
                last={index === timeline.length - 1}
              />
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-blue-600" />
            <h2 className="font-semibold text-gray-900">Shipment Information</h2>
          </div>

          <div className="mt-6 divide-y divide-gray-100">
            <InfoRow label="Shipment Date" value={formatDate(shipment.shipmentDate)} />
            <InfoRow label="Expected Delivery" value={formatDate(shipment.estimatedDelivery)} />
            <InfoRow label="Vehicle" value={shipment.vehicle} />
            <InfoRow label="Booking ID" value={shipment.bookingId} />
            <InfoRow label="Status" value={shipment.status} />
          </div>
        </section>
      </div>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toUpperCase();
  const palette =
    normalized === "DELIVERED" || normalized === "COMPLETED"
      ? "bg-green-50 text-green-700 border-green-200"
      : normalized === "IN_TRANSIT"
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : normalized === "ASSIGNED"
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${palette}`}>
      {status}
    </span>
  );
}

function TimelineItem({ title, description, completed, current, last }: { title: string; description: string; completed: boolean; current: boolean; last: boolean }) {
  return (
    <div className="flex gap-3 pb-5 last:pb-0">
      <div className="flex flex-col items-center">
        <div className={`h-4 w-4 rounded-full border-2 ${completed ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"}`} />
        {!last && <div className={`mt-2 h-full w-px ${completed ? "bg-blue-200" : "bg-gray-200"}`} />}
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between gap-4">
          <p className={`text-sm font-medium ${current ? "text-blue-700" : "text-gray-700"}`}>{title}</p>
          {completed && <Check size={16} className="text-blue-600" />}
        </div>

        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function Location({ label, location }: { label: string; location: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-gray-900">{location}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

function ShipmentNotFound({ message }: { message?: string }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Shipment not found</h1>
        <p className="mt-3 text-sm text-gray-600">{message || "Unable to load the shipment details you requested."}</p>
      </div>
    </div>
  );
}
