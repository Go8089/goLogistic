import { PackageOpen, Search } from "lucide-react";
import { useMemo, useState } from "react";

type ShipmentStatus =
  | "Pending"
  | "In Transit"
  | "Delivered";

interface Shipment {
  id: string;
  bookingId: string;
  customer: string;
  origin: string;
  destination: string;
  vehicle: string;
  shipmentDate: string;
  estimatedDelivery: string;
  status: ShipmentStatus;
}

const shipments: Shipment[] = [
  {
    id: "TRK10001",
    bookingId: "BK10001",
    customer: "Rahul Sharma",
    origin: "Pune, Maharashtra",
    destination: "Mumbai, Maharashtra",
    vehicle: "MH12 AB 1234",
    shipmentDate: "Aug 20, 2026",
    estimatedDelivery: "Aug 22, 2026",
    status: "In Transit",
  },
  {
    id: "TRK10002",
    bookingId: "BK10002",
    customer: "Priya Enterprises",
    origin: "Pune, Maharashtra",
    destination: "Nagpur, Maharashtra",
    vehicle: "MH12 CD 5678",
    shipmentDate: "Aug 22, 2026",
    estimatedDelivery: "Aug 25, 2026",
    status: "Pending",
  },
  {
    id: "TRK10003",
    bookingId: "BK10003",
    customer: "Amit Kumar",
    origin: "Mumbai, Maharashtra",
    destination: "Pune, Maharashtra",
    vehicle: "MH12 EF 9012",
    shipmentDate: "Aug 18, 2026",
    estimatedDelivery: "Aug 20, 2026",
    status: "Delivered",
  },
  {
    id: "TRK10004",
    bookingId: "BK10004",
    customer: "Shree Industries",
    origin: "Pune, Maharashtra",
    destination: "Nashik, Maharashtra",
    vehicle: "MH12 GH 3456",
    shipmentDate: "Aug 15, 2026",
    estimatedDelivery: "Aug 17, 2026",
    status: "Delivered",
  },
];

export default function AdminShipments() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredShipments = useMemo(() => {
    const query = search.toLowerCase().trim();

    return shipments.filter((shipment) => {
      const matchesSearch =
        shipment.id.toLowerCase().includes(query) ||
        shipment.bookingId.toLowerCase().includes(query) ||
        shipment.customer.toLowerCase().includes(query) ||
        shipment.origin.toLowerCase().includes(query) ||
        shipment.destination.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || shipment.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Heading */}
      <div>
        <p className="text-sm font-medium text-blue-600">
          Administration
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Shipments
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Monitor and manage customer shipments.
        </p>
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tracking ID, booking, customer or route"
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 md:w-48"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Count */}
      <p className="mt-6 text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-900">
          {filteredShipments.length}
        </span>{" "}
        shipments
      </p>

      {/* Desktop table */}
      {filteredShipments.length > 0 ? (
        <div className="mt-3 hidden overflow-hidden rounded-xl border border-gray-200 bg-white md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Tracking ID
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Route
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Vehicle
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Delivery
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredShipments.map((shipment) => (
                  <tr
                    key={shipment.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-gray-900">
                        {shipment.id}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {shipment.bookingId}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-gray-800">
                      {shipment.customer}
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-gray-800">
                        {shipment.origin}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        → {shipment.destination}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-700">
                      {shipment.vehicle}
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm text-gray-700">
                        {shipment.estimatedDelivery}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        Booked {shipment.shipmentDate}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={shipment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Mobile cards */}
      {filteredShipments.length > 0 && (
        <div className="mt-3 space-y-3 md:hidden">
          {filteredShipments.map((shipment) => (
            <div
              key={shipment.id}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {shipment.id}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {shipment.bookingId}
                  </p>
                </div>

                <StatusBadge status={shipment.status} />
              </div>

              <div className="mt-5">
                <p className="text-xs text-gray-400">
                  Customer
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {shipment.customer}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-400">
                  Route
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {shipment.origin}
                </p>

                <p className="my-1 text-xs text-gray-400">
                  ↓
                </p>

                <p className="text-sm font-medium text-gray-800">
                  {shipment.destination}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div>
                  <p className="text-xs text-gray-400">
                    Vehicle
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {shipment.vehicle}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Delivery
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {shipment.estimatedDelivery}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: ShipmentStatus;
}) {
  return (
    <span className="inline-flex whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="mt-3 rounded-xl border border-gray-200 bg-white px-5 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-500">
        <PackageOpen size={22} />
      </div>

      <h2 className="mt-4 text-sm font-semibold text-gray-900">
        No shipments found
      </h2>

      <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
        Try changing your search or status filter.
      </p>
    </div>
  );
}