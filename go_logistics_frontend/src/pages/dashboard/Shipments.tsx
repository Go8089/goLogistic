import { Search, PackageOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getMyShipments, type CustomerShipment } from "../../services/customerService";

type ShipmentStatus = "Pending" | "Assigned" | "In Transit" | "Delivered" | "Completed";

export default function Shipments() {
  const [shipments, setShipments] = useState<CustomerShipment[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadShipments() {
      try {
        const data = await getMyShipments();
        setShipments(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load shipments");
      }
    }

    void loadShipments();
  }, []);

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const normalizedStatus = normalizeShipmentStatus(shipment.status);
      const matchesSearch =
        shipment.id.toLowerCase().includes(search.toLowerCase()) ||
        shipment.origin.toLowerCase().includes(search.toLowerCase()) ||
        shipment.destination.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status === "All" || normalizedStatus === status;

      return matchesSearch && matchesStatus;
    });
  }, [shipments, search, status]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div>
        <p className="text-sm font-medium text-blue-600">Transportation</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">My Shipments</h1>
        <p className="mt-2 text-sm text-gray-500">View and track all your transportation shipments.</p>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tracking ID, origin or destination"
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 md:w-48"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">Showing <span className="font-semibold text-gray-900">{filteredShipments.length}</span> shipments</p>
      </div>

      {filteredShipments.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <PackageOpen className="mx-auto text-gray-400" size={28} />
          <p className="mt-4 text-base font-semibold text-gray-900">No shipments yet</p>
          <p className="mt-2 text-sm text-gray-500">Your live shipment records will appear here after booking confirmation.</p>
        </div>
      ) : (
        <div className="mt-3 hidden overflow-hidden rounded-xl border border-gray-200 bg-white md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Tracking ID</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Route</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Shipment Date</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Delivery</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-6 py-5"><p className="text-sm font-semibold text-gray-900">{shipment.id}</p></td>
                    <td className="px-6 py-5"><p className="text-sm font-medium text-gray-800">{shipment.origin}</p><p className="mt-1 text-xs text-gray-500">→ {shipment.destination}</p></td>
                    <td className="px-6 py-5"><StatusBadge status={normalizeShipmentStatus(shipment.status)} /></td>
                    <td className="px-6 py-5 text-sm text-gray-600">{new Date(shipment.shipmentDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                    <td className="px-6 py-5 text-sm text-gray-600">{new Date(shipment.estimatedDelivery).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                    <td className="px-6 py-5 text-right"><Link to={`/dashboard/shipments/${shipment.id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function normalizeShipmentStatus(status: string): ShipmentStatus {
  const value = status.toUpperCase();

  if (value === "ASSIGNED") return "Assigned";
  if (value === "IN_TRANSIT") return "In Transit";
  if (value === "DELIVERED") return "Delivered";
  if (value === "COMPLETED") return "Completed";
  return "Pending";
}

function StatusBadge({ status }: { status: ShipmentStatus }) {
  const styles: Record<ShipmentStatus, string> = {
    Pending: "bg-yellow-50 text-yellow-700",
    Assigned: "bg-purple-50 text-purple-700",
    "In Transit": "bg-blue-50 text-blue-700",
    Delivered: "bg-green-50 text-green-700",
    Completed: "bg-emerald-50 text-emerald-700",
  };

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>{status}</span>;
}
