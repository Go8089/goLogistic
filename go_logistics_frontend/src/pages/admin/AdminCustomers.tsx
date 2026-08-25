import { Search, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAdminCustomers, updateAdminCustomerStatus } from "../../services/adminService";

type CustomerStatus = "Active" | "Inactive";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  shipments: number;
  joinedDate: string;
  status: CustomerStatus;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await getAdminCustomers();
        setCustomers(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load customers");
      }
    }

    void loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return customers.filter((customer) => {
      const matchesSearch =
        customer.id.toLowerCase().includes(query) ||
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || customer.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const handleCustomerStatusChange = async (customerId: string, nextStatus: CustomerStatus) => {
    try {
      const updated = await updateAdminCustomerStatus(customerId, nextStatus);
      setCustomers((current) =>
        current.map((customer) =>
          customer.id === customerId
            ? { ...customer, status: updated.status === "Active" ? "Active" : "Inactive" }
            : customer
        )
      );
      setError("");
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Unable to update customer status");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Heading */}
      <div>
        <p className="text-sm font-medium text-blue-600">
          Administration
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Customers
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          View and manage registered customers.
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
              placeholder="Search customer, email or phone"
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 md:w-48"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Count */}
      <div className="mt-6">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredCustomers.length}
          </span>{" "}
          customers
        </p>
      </div>

      {/* Desktop */}
      {filteredCustomers.length > 0 ? (
        <div className="mt-3 hidden overflow-hidden rounded-xl border border-gray-200 bg-white md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Contact
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Shipments
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-gray-900">
                        {customer.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {customer.id}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm text-gray-800">
                        {customer.email}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {customer.phone}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-gray-900">
                      {customer.shipments}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {customer.joinedDate}
                    </td>

                    <td className="px-6 py-5">
                     <div className="flex items-center gap-3">
                       <StatusBadge status={customer.status} />
                       <button
                         type="button"
                         onClick={() => void handleCustomerStatusChange(customer.id, customer.status === "Active" ? "Inactive" : "Active")}
                         className="rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                       >
                         {customer.status === "Active" ? "Deactivate" : "Activate"}
                       </button>
                     </div>
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
      {filteredCustomers.length > 0 && (
        <div className="mt-3 space-y-3 md:hidden">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {customer.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {customer.id}
                  </p>
                </div>

                <StatusBadge status={customer.status} />
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => void handleCustomerStatusChange(customer.id, customer.status === "Active" ? "Inactive" : "Active")}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                >
                  {customer.status === "Active" ? "Deactivate Account" : "Activate Account"}
                </button>
              </div>

              <div className="mt-5 space-y-3">
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="mt-1 text-sm text-gray-800">
                    {customer.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="mt-1 text-sm text-gray-800">
                    {customer.phone}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div>
                  <p className="text-xs text-gray-400">
                    Shipments
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {customer.shipments}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Joined
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {customer.joinedDate}
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
  status: CustomerStatus;
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
        <Users size={22} />
      </div>

      <h2 className="mt-4 text-sm font-semibold text-gray-900">
        No customers found
      </h2>

      <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
        Try changing your search or status filter.
      </p>
    </div>
  );
}