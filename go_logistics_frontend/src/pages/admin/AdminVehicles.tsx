import { Search, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAdminVehicles } from "../../services/adminService";

type VehicleStatus = "Available" | "Assigned" | "Maintenance";

interface Vehicle {
  id: string;
  registrationNumber: string;
  vehicleType: string;
  containerSize: string;
  capacity: string;
  driver: string;
  status: VehicleStatus;
}

export default function AdminVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVehicles() {
      try {
        const data = await getAdminVehicles();
        setVehicles(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load vehicles");
      }
    }

    void loadVehicles();
  }, []);

  const filteredVehicles = useMemo(() => {
    const query = search.toLowerCase().trim();

    return vehicles.filter((vehicle) => {
      const matchesSearch =
        vehicle.registrationNumber
          .toLowerCase()
          .includes(query) ||
        vehicle.vehicleType.toLowerCase().includes(query) ||
        vehicle.containerSize.toLowerCase().includes(query) ||
        vehicle.driver.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || vehicle.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Heading */}
      <div>
        <p className="text-sm font-medium text-blue-600">
          Fleet Management
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Vehicles
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage vehicles, container sizes, capacity and assignments.
        </p>
        {error && (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
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
              placeholder="Search registration, vehicle, container size or driver"
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 md:w-48"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Assigned">Assigned</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Count */}
      <p className="mt-6 text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-900">
          {filteredVehicles.length}
        </span>{" "}
        vehicles
      </p>

      {/* Desktop table */}
      {filteredVehicles.length > 0 ? (
        <div className="mt-3 hidden overflow-hidden rounded-xl border border-gray-200 bg-white md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Registration
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Vehicle
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Container Size
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Capacity
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Driver
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-gray-900">
                        {vehicle.registrationNumber}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {vehicle.id}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-gray-800">
                        {vehicle.vehicleType}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-gray-800">
                      {vehicle.containerSize}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-700">
                      {vehicle.capacity}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-700">
                      {vehicle.driver}
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={vehicle.status} />
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
      {filteredVehicles.length > 0 && (
        <div className="mt-3 space-y-3 md:hidden">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {vehicle.registrationNumber}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {vehicle.vehicleType}
                  </p>
                </div>

                <StatusBadge status={vehicle.status} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <Info
                  label="Container"
                  value={vehicle.containerSize}
                />

                <Info
                  label="Capacity"
                  value={vehicle.capacity}
                />

                <Info
                  label="Driver"
                  value={vehicle.driver}
                />

                <Info
                  label="Vehicle ID"
                  value={vehicle.id}
                />
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
  status: VehicleStatus;
}) {
  const classes =
    status === "Available"
      ? "bg-green-50 text-green-700"
      : status === "Assigned"
        ? "bg-blue-50 text-blue-700"
        : "bg-orange-50 text-orange-700";

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}
    >
      {status}
    </span>
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
      <p className="text-xs text-gray-400">{label}</p>

      <p className="mt-1 text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-3 rounded-xl border border-gray-200 bg-white px-5 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-500">
        <Truck size={22} />
      </div>

      <h2 className="mt-4 text-sm font-semibold text-gray-900">
        No vehicles found
      </h2>

      <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
        Try changing your search or status filter.
      </p>
    </div>
  );
}