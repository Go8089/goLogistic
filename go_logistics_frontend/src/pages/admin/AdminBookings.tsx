import { CalendarDays, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAdminBookings } from "../../services/adminService";

type BookingStatus =
  | "Created"
  | "Payment Pending"
  | "Confirmed"
  | "Assigned"
  | "In Transit"
  | "Delivered"
  | "Completed"
  | "Cancelled";

interface Booking {
  id: string;
  customer: string;
  route: string;
  vehicle: string;
  bookingDate: string;
  amount: string;
  status: BookingStatus;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await getAdminBookings();
        setBookings(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load bookings");
      }
    }

    void loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const query = search.toLowerCase().trim();

    return bookings.filter((booking) => {
      const normalizedStatus = normalizeBookingStatus(booking.status);
      const matchesSearch =
        booking.id.toLowerCase().includes(query) ||
        booking.customer.toLowerCase().includes(query) ||
        booking.route.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || normalizedStatus === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status, bookings]);

  function normalizeBookingStatus(label: string): BookingStatus {
    const value = label.toUpperCase();

    if (value.includes("PAYMENT")) return "Payment Pending";
    if (value === "CREATED") return "Created";
    if (value === "CONFIRMED") return "Confirmed";
    if (value === "ASSIGNED") return "Assigned";
    if (value === "IN_TRANSIT") return "In Transit";
    if (value === "DELIVERED") return "Delivered";
    if (value === "COMPLETED") return "Completed";
    if (value === "CANCELLED") return "Cancelled";
    return "Created";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Heading */}
      <div>
        <p className="text-sm font-medium text-blue-600">
          Administration
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Bookings
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          View and manage customer transportation bookings.
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
              placeholder="Search booking ID, customer or route"
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 md:w-48"
          >
            <option value="All">All Statuses</option>
            <option value="Created">Created</option>
            <option value="Payment Pending">Payment Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Assigned">Assigned</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Count */}
      <p className="mt-6 text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-900">
          {filteredBookings.length}
        </span>{" "}
        bookings
      </p>

      {/* Desktop */}
      {filteredBookings.length > 0 ? (
        <div className="mt-3 hidden overflow-hidden rounded-xl border border-gray-200 bg-white md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Booking
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
                    Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-gray-900">
                        {booking.id}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-gray-800">
                      {booking.customer}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-700">
                      {booking.route}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-700">
                      {booking.vehicle}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {booking.bookingDate}
                    </td>

                    <td className="px-6 py-5 text-sm font-semibold text-gray-900">
                      {booking.amount}
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={booking.status} />
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

      {/* Mobile */}
      {filteredBookings.length > 0 && (
        <div className="mt-3 space-y-3 md:hidden">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {booking.id}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {booking.bookingDate}
                  </p>
                </div>

                <StatusBadge status={booking.status} />
              </div>

              <div className="mt-5">
                <p className="text-xs text-gray-400">
                  Customer
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {booking.customer}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-400">
                  Route
                </p>

                <p className="mt-1 text-sm font-medium text-gray-800">
                  {booking.route}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div>
                  <p className="text-xs text-gray-400">
                    Vehicle
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {booking.vehicle}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Amount
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {booking.amount}
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
  status: BookingStatus;
}) {
  const styles: Record<BookingStatus, string> = {
    Created: "bg-gray-100 text-gray-700",
    "Payment Pending": "bg-yellow-50 text-yellow-700",
    Confirmed: "bg-blue-50 text-blue-700",
    Assigned: "bg-purple-50 text-purple-700",
    "In Transit": "bg-indigo-50 text-indigo-700",
    Delivered: "bg-green-50 text-green-700",
    Completed: "bg-emerald-50 text-emerald-700",
    Cancelled: "bg-red-50 text-red-700",
  };

  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="mt-3 rounded-xl border border-gray-200 bg-white px-5 py-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-500">
        <CalendarDays size={22} />
      </div>

      <h2 className="mt-4 text-sm font-semibold text-gray-900">
        No bookings found
      </h2>

      <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
        Try changing your search or status filter.
      </p>
    </div>
  );
}