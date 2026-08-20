import {
  CreditCard,
  Search,
  Eye,
} from "lucide-react";
import { useMemo, useState } from "react";

type PaymentStatus =
  | "Paid"
  | "Pending"
  | "Failed"
  | "Refunded";

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

const payments: Payment[] = [
  {
    id: "PAY10001",
    quoteId: "QT10001",
    customer: "Gopal Kumar Jha",
    email: "gopal@example.com",
    amount: 18000,
    method: "UPI",
    date: "Aug 20, 2026",
    status: "Paid",
  },
  {
    id: "PAY10002",
    quoteId: "QT10002",
    customer: "Rahul Sharma",
    email: "rahul@example.com",
    amount: 32000,
    method: "Credit Card",
    date: "Aug 21, 2026",
    status: "Pending",
  },
  {
    id: "PAY10003",
    quoteId: "QT10003",
    customer: "Amit Verma",
    email: "amit@example.com",
    amount: 12500,
    method: "Net Banking",
    date: "Aug 18, 2026",
    status: "Paid",
  },
  {
    id: "PAY10004",
    quoteId: "QT10004",
    customer: "Priya Singh",
    email: "priya@example.com",
    amount: 15800,
    method: "UPI",
    date: "Aug 17, 2026",
    status: "Failed",
  },
  {
    id: "PAY10005",
    quoteId: "QT10005",
    customer: "Vikash Kumar",
    email: "vikash@example.com",
    amount: 22000,
    method: "Credit Card",
    date: "Aug 15, 2026",
    status: "Refunded",
  },
];

export default function AdminPayments() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const query = search.toLowerCase();

      const matchesSearch =
        payment.id.toLowerCase().includes(query) ||
        payment.quoteId.toLowerCase().includes(query) ||
        payment.customer.toLowerCase().includes(query) ||
        payment.email.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" ||
        payment.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  const totalRevenue = payments
    .filter((payment) => payment.status === "Paid")
    .reduce(
      (total, payment) => total + payment.amount,
      0
    );

  const pendingAmount = payments
    .filter((payment) => payment.status === "Pending")
    .reduce(
      (total, payment) => total + payment.amount,
      0
    );

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
      </div>

      {/* Summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        <SummaryCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
          description="Successfully paid"
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
            <option value="Paid">Paid</option>
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
                      <StatusBadge status={payment.status} />
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
    Paid: "bg-green-50 text-green-700",
    Pending: "bg-yellow-50 text-yellow-700",
    Failed: "bg-red-50 text-red-700",
    Refunded: "bg-gray-100 text-gray-700",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}