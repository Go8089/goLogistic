import {
  ArrowLeft,
  Check,
  Clock3,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

const shipmentData = {
  TRK10001: {
  id: "TRK10001",
  origin: "Pune, Maharashtra",
  destination: "Mumbai, Maharashtra",
  status: "In Transit",
  shipmentDate: "Aug 20, 2026",
  estimatedDelivery: "Aug 22, 2026",
  vehicle: "Truck - MH12 AB 1234",
  vehicleType: "Heavy Truck",
  bodyType: "Container",
  containerSize: "32 ft",
  weight: "850 kg",
  cargo: "Commercial Goods",
},
  TRK10002: {
  id: "TRK10002",
  origin: "Pune, Maharashtra",
  destination: "Mumbai, Maharashtra",
  status: "In Transit",
  shipmentDate: "Aug 20, 2026",
  estimatedDelivery: "Aug 22, 2026",
  vehicle: "Truck - MH12 AB 1234",
  vehicleType: "Heavy Truck",
  bodyType: "Container",
  containerSize: "32 ft",
  weight: "850 kg",
  cargo: "Commercial Goods",
},
  TRK10003: {
  id: "TRK10003",
  origin: "Pune, Maharashtra",
  destination: "Mumbai, Maharashtra",
  status: "In Transit",
  shipmentDate: "Aug 20, 2026",
  estimatedDelivery: "Aug 22, 2026",
  vehicle: "Truck - MH12 AB 1234",
  vehicleType: "Heavy Truck",
  bodyType: "Container",
  containerSize: "32 ft",
  weight: "850 kg",
  cargo: "Commercial Goods",
},
  TRK10004: {
  id: "TRK10004",
  origin: "Pune, Maharashtra",
  destination: "Mumbai, Maharashtra",
  status: "In Transit",
  shipmentDate: "Aug 20, 2026",
  estimatedDelivery: "Aug 22, 2026",
  vehicle: "Truck - MH12 AB 1234",
  vehicleType: "Heavy Truck",
  bodyType: "Container",
  containerSize: "32 ft",
  weight: "850 kg",
  cargo: "Commercial Goods",
},
  TRK10005: {
  id: "TRK10005",
  origin: "Pune, Maharashtra",
  destination: "Mumbai, Maharashtra",
  status: "In Transit",
  shipmentDate: "Aug 20, 2026",
  estimatedDelivery: "Aug 22, 2026",
  vehicle: "Truck - MH12 AB 1234",
  vehicleType: "Heavy Truck",
  bodyType: "Container",
  containerSize: "32 ft",
  weight: "850 kg",
  cargo: "Commercial Goods",
},
};

type Shipment = (typeof shipmentData)[keyof typeof shipmentData];

function getTimeline(status: string) {
  const steps = [
    {
      title: "Shipment Booked",
      description: "Shipment request has been confirmed.",
    },
    {
      title: "Picked Up",
      description: "Cargo picked up from the origin.",
    },
    {
      title: "In Transit",
      description: "Shipment is currently on the way.",
    },
    {
      title: "Out for Delivery",
      description: "Shipment is on the way to the destination.",
    },
    {
      title: "Delivered",
      description: "Shipment delivered successfully.",
    },
  ];

  const statusIndex =
    status === "Pending"
      ? 0
      : status === "In Transit"
        ? 2
        : status === "Delivered"
          ? 4
          : 0;

  return steps.map((step, index) => ({
    ...step,
    completed: index <= statusIndex,
    date:
      index <= statusIndex
        ? "Completed"
        : index === statusIndex + 1
          ? "Upcoming"
          : "Pending",
  }));
}

export default function ShipmentDetails() {
  const { id } = useParams();

  const shipment = shipmentData[
    id as keyof typeof shipmentData
  ] as Shipment | undefined;

  if (!shipment) {
    return <ShipmentNotFound />;
  }
const timeline = getTimeline(shipment.status);
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Back */}
      <Link
        to="/dashboard/shipments"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back to Shipments
      </Link>

      {/* Header */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Shipment Details
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {shipment.id}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Shipment from {shipment.origin} to{" "}
            {shipment.destination}
          </p>
        </div>

        <StatusBadge status={shipment.status} />
      </div>

      {/* Route */}
      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-blue-600" />

          <h2 className="font-semibold text-gray-900">
            Shipment Route
          </h2>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <Location
            label="Origin"
            location={shipment.origin}
          />

          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              <div className="h-px w-16 bg-gray-300 lg:w-28" />

              <Truck size={20} className="text-blue-600" />

              <div className="h-px w-16 bg-gray-300 lg:w-28" />
            </div>
          </div>

          <Location
            label="Destination"
            location={shipment.destination}
          />
        </div>
      </section>

      {/* Main grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Timeline */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Clock3 size={18} className="text-blue-600" />

            <h2 className="font-semibold text-gray-900">
              Shipment Progress
            </h2>
          </div>

          <div className="mt-6">
            {timeline.map((item, index) => (
              <TimelineItem
                key={item.title}
                {...item}
                last={index === timeline.length - 1}
              />
            ))}
          </div>
        </section>

        {/* Shipment information */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-blue-600" />

            <h2 className="font-semibold text-gray-900">
              Shipment Information
            </h2>
          </div>

          <div className="mt-6 divide-y divide-gray-100">
            <InfoRow
              label="Shipment Date"
              value={shipment.shipmentDate}
            />

            <InfoRow
              label="Expected Delivery"
              value={shipment.estimatedDelivery}
            />

            <InfoRow
              label="Cargo Type"
              value={shipment.cargo}
            />

            <InfoRow
              label="Weight"
              value={shipment.weight}
            />

              <InfoRow
  label="Vehicle"
  value={shipment.vehicle}
/>

<InfoRow
  label="Vehicle Type"
  value={shipment.vehicleType}
/>

<InfoRow
  label="Body Type"
  value={shipment.bodyType}
/>

<InfoRow
  label="Container Size"
  value={shipment.containerSize}
/>
          </div>
        </section>
      </div>

      {/* Tracking CTA */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">
              Need live tracking?
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              View the latest tracking information for this shipment.
            </p>
          </div>

          <Link
            to="/dashboard/tracking"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Track Shipment
          </Link>
        </div>
      </section>
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
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-base font-semibold text-gray-900">
        {location}
      </p>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="text-right text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}

function TimelineItem({
  title,
  description,
  date,
  completed,
  last,
}: {
  title: string;
  description: string;
  date: string;
  completed: boolean;
  last: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            completed
              ? "bg-blue-600 text-white"
              : "border border-gray-300 bg-white text-gray-400",
          ].join(" ")}
        >
          {completed ? <Check size={15} /> : <span className="h-2 w-2 rounded-full bg-gray-300" />}
        </div>

        {!last && (
          <div
            className={[
              "mt-1 w-px flex-1",
              completed ? "bg-blue-200" : "bg-gray-200",
            ].join(" ")}
          />
        )}
      </div>

      <div className={last ? "pb-0" : "pb-7"}>
        <p
          className={[
            "text-sm font-semibold",
            completed
              ? "text-gray-900"
              : "text-gray-400",
          ].join(" ")}
        >
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          {description}
        </p>

        <p className="mt-1.5 text-xs font-medium text-gray-400">
          {date}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex w-fit rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
      {status}
    </span>
  );
}

function ShipmentNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-500">
        <Package size={22} />
      </div>

      <h1 className="mt-4 text-xl font-bold text-gray-900">
        Shipment not found
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        The shipment you're looking for doesn't exist.
      </p>

      <Link
        to="/dashboard/shipments"
        className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Back to Shipments
      </Link>
    </div>
  );
}