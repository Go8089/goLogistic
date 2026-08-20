import { useState } from "react";
import type { SubmitEvent } from "react";
import {
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Truck,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import Input from "../components/Input";
import Button from "../components/Button";

interface Shipment {
  trackingId: string;
  status: "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED";
  origin: string;
  destination: string;
  estimatedDelivery: string;
  vehicle: string;
  lastUpdate: string;
}

const demoShipment: Shipment = {
  trackingId: "TRK10001",
  status: "IN_TRANSIT",
  origin: "Pune, Maharashtra",
  destination: "Mumbai, Maharashtra",
  estimatedDelivery: "August 22, 2026",
  vehicle: "Medium Cargo Truck",
  lastUpdate: "Shipment departed from Pune",
};

const statusSteps = [
  {
    key: "BOOKED",
    title: "Shipment Booked",
    description: "Transportation request has been confirmed.",
  },
  {
    key: "IN_TRANSIT",
    title: "In Transit",
    description: "Cargo is currently moving towards its destination.",
  },
  {
    key: "OUT_FOR_DELIVERY",
    title: "Out for Delivery",
    description: "Cargo has reached the delivery area.",
  },
  {
    key: "DELIVERED",
    title: "Delivered",
    description: "Cargo has been successfully delivered.",
  },
];

export default function Tracking() {
  const [trackingId, setTrackingId] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedId = trackingId.trim().toUpperCase();

    if (!normalizedId) {
      setShipment(null);
      setNotFound(false);
      return;
    }

    if (normalizedId === demoShipment.trackingId) {
      setShipment(demoShipment);
      setNotFound(false);
      return;
    }

    setShipment(null);
    setNotFound(true);
  };

  return (
    <>
      <PageHeader
        eyebrow="Track Shipment"
        title="Know where your cargo is."
        description="Enter your tracking ID to view the current status and transportation details of your shipment."
      />

      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Input
                  label="Tracking ID"
                  name="trackingId"
                  placeholder="e.g. TRK10001"
                  value={trackingId}
                  onChange={(value) => {
                    setTrackingId(value);
                    setNotFound(false);
                  }}
                  required
                />
              </div>

              <Button type="submit" className="sm:min-w-36">
                Track Shipment
              </Button>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Demo tracking ID:{" "}
              <span className="font-semibold text-gray-700">
                TRK10001
              </span>
            </p>
          </form>

          {/* Not found */}
          {notFound && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-sm font-semibold text-gray-900">
                Shipment not found
              </p>

              <p className="mt-1 text-sm text-gray-600">
                We couldn't find a shipment with that tracking ID. Please
                check the ID and try again.
              </p>
            </div>
          )}

          {/* Shipment */}
          {shipment && (
            <div className="mt-8 space-y-6">
              {/* Overview */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                      Tracking ID
                    </p>

                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                      {shipment.trackingId}
                    </h2>
                  </div>

                  <StatusBadge status={shipment.status} />
                </div>

                <div className="mt-8 grid gap-5 border-t border-gray-100 pt-6 sm:grid-cols-2">
                  <ShipmentDetail
                    icon={MapPin}
                    label="Origin"
                    value={shipment.origin}
                  />

                  <ShipmentDetail
                    icon={MapPin}
                    label="Destination"
                    value={shipment.destination}
                  />

                  <ShipmentDetail
                    icon={Truck}
                    label="Vehicle"
                    value={shipment.vehicle}
                  />

                  <ShipmentDetail
                    icon={Clock3}
                    label="Estimated Delivery"
                    value={shipment.estimatedDelivery}
                  />
                </div>
              </div>

              {/* Timeline */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <Package size={21} className="text-blue-600" />

                  <h2 className="text-xl font-semibold text-gray-900">
                    Shipment Progress
                  </h2>
                </div>

                <div className="mt-8">
                  {statusSteps.map((step, index) => {
                    const completed = isStepCompleted(
                      shipment.status,
                      step.key,
                    );

                    const current =
                      shipment.status === step.key;

                    return (
                      <div
                        key={step.key}
                        className="relative flex gap-4 pb-8 last:pb-0"
                      >
                        {index !== statusSteps.length - 1 && (
                          <div
                            className={`absolute left-[15px] top-8 h-full w-px ${
                              completed
                                ? "bg-blue-600"
                                : "bg-gray-200"
                            }`}
                          />
                        )}

                        <div
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                            completed
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-gray-300 bg-white text-gray-400"
                          }`}
                        >
                          {completed ? (
                            <CheckCircle2 size={17} />
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-current" />
                          )}
                        </div>

                        <div className="pt-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3
                              className={`text-sm font-semibold ${
                                current
                                  ? "text-blue-600"
                                  : "text-gray-900"
                              }`}
                            >
                              {step.title}
                            </h3>

                            {current && (
                              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                                Current
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-sm leading-6 text-gray-500">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Latest update */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Latest Update
                </p>

                <p className="mt-2 text-sm font-medium text-gray-900">
                  {shipment.lastUpdate}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

interface ShipmentDetailProps {
  icon: typeof MapPin;
  label: string;
  value: string;
}

function ShipmentDetail({
  icon: Icon,
  label,
  value,
}: ShipmentDetailProps) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-600">
        <Icon size={17} />
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: Shipment["status"];
}) {
  const labels = {
    IN_TRANSIT: "In Transit",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
  };

  return (
    <span className="inline-flex w-fit items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
      {labels[status]}
    </span>
  );
}

function isStepCompleted(
  status: Shipment["status"],
  step: string,
) {
  const order = [
    "BOOKED",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];

  const currentIndex = order.indexOf(status);
  const stepIndex = order.indexOf(step);

  return stepIndex <= currentIndex;
}