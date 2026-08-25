import {
  CreditCard,
  Search,
  Eye,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAdminPayments } from "../../services/adminService";

type PaymentStatus =
  | "Success"
  | "Pending"
  | "Failed"
  | "Refunded"
  | "Paid";

interface Payment {
  id: string;
  quoteId: string;
  customer: string;
  email: string;
  amount: number;
  method: string;
  date: string;
  status: PaymentStatus;
}

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPayments() {
      try {
        const data = await getAdminPayments();
        setPayments(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load payments");
      }
    }

    void loadPayments();
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const query = search.toLowerCase();
      const normalizedStatus = normalizePaymentStatus(payment.status);

      const matchesSearch =
        payment.id.toLowerCase().includes(query) ||
        payment.quoteId.toLowerCase().includes(query) ||
        payment.customer.toLowerCase().includes(query) ||
        payment.email.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" ||
        normalizedStatus === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status, payments]);

  const totalRevenue = payments
    .filter((payment) => normalizePaymentStatus(payment.status) === "Success")
    .reduce(
      (total, payment) => total + payment.amount,
      0
    );

  const pendingAmount = payments
    .filter((payment) => normalizePaymentStatus(payment.status) === "Pending")
    .reduce(
      (total, payment) => total + payment.amount,
      0
    );

  function normalizePaymentStatus(status: string): PaymentStatus {
    const value = status.toUpperCase();

    if (value === "SUCCESS" || value === "PAID") {
      return "Success";
    }

    if (value === "PENDING") {
      return "Pending";
    }

    if (value === "FAILED") {
      return "Failed";
    }

    if (value === "REFUNDED") {
      return "Refunded";
    }

    return "Pending";
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

      {/* Heading */}
      <div>
        <p className="text-sm font-medium text-blue-600">
          Finance
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Payments
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          View and manage customer payment transactions.
        </p>
        {error && (
          <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <SummaryCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
          description="Successful payments"
        />

        <SummaryCard
          title="Pending Payments"
          value={`₹${pendingAmount.toLocaleString("en-IN")}`}
          description="Awaiting payment"
        />

        <SummaryCard
          title="Transactions"
          value={payments.length.toString()}
          description="Total transactions"
        />

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
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search payment ID, quote ID or customer"
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 md:w-48"
          >
            <option value="All">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>

        </div>
      </div>

      {/* Count */}
      <p className="mt-6 text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-900">
          {filteredPayments.length}
        </span>{" "}
        payments
      </p>

      {/* Table */}
      {filteredPayments.length > 0 ? (
        <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">

              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Payment
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Method
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>
                {filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-gray-100 last:border-0"
                  >

                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-gray-900">
                        {payment.id}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {payment.quoteId}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-gray-800">
                        {payment.customer}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {payment.email}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm font-semibold text-gray-900">
                      ₹{payment.amount.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {payment.method}
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {payment.date}
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={normalizePaymentStatus(payment.status)} />
                    </td>

                    <td className="px-6 py-5 text-right">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      ) : (
        <div className="mt-3 rounded-xl border border-gray-200 bg-white px-5 py-14 text-center">
          <CreditCard
            size={24}
            className="mx-auto text-gray-400"
          />

          <h2 className="mt-4 text-sm font-semibold text-gray-900">
            No payments found
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Try changing your search or status filter.
          </p>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {description}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: PaymentStatus;
}) {
  const styles = {
    Success: "bg-green-50 text-green-700",
    Pending: "bg-yellow-50 text-yellow-700",
    Failed: "bg-red-50 text-red-700",
    Refunded: "bg-gray-100 text-gray-700",
    Paid: "bg-green-50 text-green-700",
  };

  const labels = {
    Success: "Success",
    Pending: "Pending",
    Failed: "Failed",
    Refunded: "Refunded",
    Paid: "Paid",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] ?? "bg-gray-100 text-gray-700"}`}
    >
      {labels[status] ?? status}
    </span>
  );
}