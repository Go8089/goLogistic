import {
  ArrowRight,
  Clock3,
  Package,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    label: "Active Shipments",
    value: "3",
    icon: Truck,
  },
  {
    label: "Delivered",
    value: "18",
    icon: Package,
  },
  {
    label: "Pending Quotes",
    value: "2",
    icon: Clock3,
  },
];

const recentShipments = [
  {
    id: "TRK10001",
    destination: "Mumbai, Maharashtra",
    status: "In Transit",
    date: "Aug 22, 2026",
  },
  {
    id: "TRK10002",
    destination: "Nashik, Maharashtra",
    status: "Delivered",
    date: "Aug 17, 2026",
  },
  {
    id: "TRK10003",
    destination: "Nagpur, Maharashtra",
    status: "In Transit",
    date: "Aug 25, 2026",
  },
];

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Welcome */}
      <div>
        <p className="text-sm font-medium text-blue-600">
          Welcome back
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Good morning, Customer
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Here's an overview of your transportation activity.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/dashboard/quotes/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Request a Quote
          <ArrowRight size={16} />
        </Link>

        <Link
          to="/dashboard/tracking"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
        >
          Track Shipment
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon size={19} />
                </div>
              </div>

              <p className="mt-5 text-2xl font-bold text-gray-900">
                {stat.value}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Shipments */}
      <section className="mt-8 rounded-xl border border-gray-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-semibold text-gray-900">
              Recent Shipments
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Your latest transportation activity.
            </p>
          </div>

          <Link
            to="/dashboard/shipments"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View all
          </Link>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Tracking ID
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Destination
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Delivery
                </th>
              </tr>
            </thead>

            <tbody>
              {recentShipments.map((shipment) => (
                <tr
                  key={shipment.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {shipment.id}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {shipment.destination}
                  </td>

                  <td className="px-6 py-4">
                    <Status status={shipment.status} />
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {shipment.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-gray-100 md:hidden">
          {recentShipments.map((shipment) => (
            <div key={shipment.id} className="p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gray-900">
                  {shipment.id}
                </p>

                <Status status={shipment.status} />
              </div>

              <p className="mt-3 text-sm text-gray-600">
                {shipment.destination}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Expected delivery: {shipment.date}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Status({ status }: { status: string }) {
  return (
    <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
      {status}
    </span>
  );
}