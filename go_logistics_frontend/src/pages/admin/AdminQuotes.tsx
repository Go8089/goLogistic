import {
  ArrowLeft,
  Check,
  FileText,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type QuoteStatus = "Pending" | "Approved" | "Rejected";

interface Quote {
  id: string;
  customer: string;
  email: string;
  origin: string;
  destination: string;
  cargo: string;
  weight: string;
  containerSize: string;
  requestedDate: string;
  requestedVehicle: string;
  amount: string;
  status: QuoteStatus;
}

const initialQuotes: Quote[] = [
  {
    id: "QT10021",
    customer: "Rahul Sharma",
    email: "rahul@example.com",
    origin: "Pune, Maharashtra",
    destination: "Mumbai, Maharashtra",
    cargo: "Commercial Goods",
    weight: "850 kg",
    containerSize: "20 ft",
    requestedDate: "Aug 20, 2026",
    requestedVehicle: "Container Truck",
    amount: "",
    status: "Pending",
  },
  {
    id: "QT10020",
    customer: "Amit Kumar",
    email: "amit@example.com",
    origin: "Mumbai, Maharashtra",
    destination: "Nashik, Maharashtra",
    cargo: "General Cargo",
    weight: "620 kg",
    containerSize: "17 ft",
    requestedDate: "Aug 21, 2026",
    requestedVehicle: "Truck",
    amount: "₹22,000",
    status: "Approved",
  },
  {
    id: "QT10019",
    customer: "Neha Singh",
    email: "neha@example.com",
    origin: "Pune, Maharashtra",
    destination: "Nagpur, Maharashtra",
    cargo: "Industrial Equipment",
    weight: "1,200 kg",
    containerSize: "32 ft",
    requestedDate: "Aug 23, 2026",
    requestedVehicle: "Container Truck",
    amount: "",
    status: "Pending",
  },
  {
    id: "QT10018",
    customer: "Vikas Patel",
    email: "vikas@example.com",
    origin: "Pune, Maharashtra",
    destination: "Aurangabad, Maharashtra",
    cargo: "Commercial Goods",
    weight: "700 kg",
    containerSize: "20 ft",
    requestedDate: "Aug 24, 2026",
    requestedVehicle: "Container Truck",
    amount: "₹15,800",
    status: "Approved",
  },
];

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [selectedQuote, setSelectedQuote] =
    useState<Quote | null>(null);

  const filteredQuotes = useMemo(() => {
    const query = search.toLowerCase();

    return quotes.filter((quote) => {
      const matchesSearch =
        quote.id.toLowerCase().includes(query) ||
        quote.customer.toLowerCase().includes(query) ||
        quote.origin.toLowerCase().includes(query) ||
        quote.destination.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || quote.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [quotes, search, status]);

  function updateQuoteStatus(
    quoteId: string,
    newStatus: QuoteStatus,
    amount?: string
  ) {
    setQuotes((currentQuotes) =>
      currentQuotes.map((quote) =>
        quote.id === quoteId
          ? {
              ...quote,
              status: newStatus,
              amount: amount ?? quote.amount,
            }
          : quote
      )
    );

    setSelectedQuote(null);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

      {/* Back */}
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      {/* Heading */}
      <div className="mt-6">
        <p className="text-sm font-medium text-blue-600">
          Administration
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Quote Management
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Review customer requests and manage transportation quotes.
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
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search quote ID, customer or route"
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
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Count */}
      <p className="mt-6 text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-900">
          {filteredQuotes.length}
        </span>{" "}
        quote requests
      </p>

      {/* Table */}
      <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Quote
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Customer
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Route
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Cargo
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
              {filteredQuotes.map((quote) => (
                <tr
                  key={quote.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold text-gray-900">
                      {quote.id}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {quote.requestedDate}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-gray-800">
                      {quote.customer}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {quote.email}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-gray-800">
                      {quote.origin}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      → {quote.destination}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm text-gray-700">
                      {quote.cargo}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {quote.weight} · {quote.containerSize}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <StatusBadge status={quote.status} />
                  </td>

                  <td className="px-6 py-5 text-right">
                    <Link
                   to={`/admin/quotes/${quote.id}`}
                   className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                     >
                    View Quote
                   </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuotes.length === 0 && (
          <div className="px-5 py-14 text-center">
            <FileText
              size={22}
              className="mx-auto text-gray-400"
            />

            <h2 className="mt-4 text-sm font-semibold text-gray-900">
              No quotes found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or status filter.
            </p>
          </div>
        )}
      </div>

      {/* Quote modal */}
      {selectedQuote && (
        <QuoteModal
          quote={selectedQuote}
          onClose={() => setSelectedQuote(null)}
          onApprove={(amount) =>
            updateQuoteStatus(
              selectedQuote.id,
              "Approved",
              amount
            )
          }
          onReject={() =>
            updateQuoteStatus(
              selectedQuote.id,
              "Rejected"
            )
          }
        />
      )}
    </div>
  );
}

function QuoteModal({
  quote,
  onClose,
  onApprove,
  onReject,
}: {
  quote: Quote;
  onClose: () => void;
  onApprove: (amount: string) => void;
  onReject: () => void;
}) {
  const [amount, setAmount] = useState(
    quote.amount.replace("₹", "")
  );

  const isPending = quote.status === "Pending";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-medium text-blue-600">
              Quote Request
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              {quote.id}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Details */}
        <div className="space-y-6 px-5 py-6 sm:px-6">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Customer
            </p>

            <p className="mt-2 text-sm font-semibold text-gray-900">
              {quote.customer}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {quote.email}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Detail
              label="Origin"
              value={quote.origin}
            />

            <Detail
              label="Destination"
              value={quote.destination}
            />

            <Detail
              label="Cargo Type"
              value={quote.cargo}
            />

            <Detail
              label="Weight"
              value={quote.weight}
            />

            <Detail
              label="Container Size"
              value={quote.containerSize}
            />

            <Detail
              label="Vehicle"
              value={quote.requestedVehicle}
            />

            <Detail
              label="Requested Date"
              value={quote.requestedDate}
            />

            <Detail
              label="Current Status"
              value={quote.status}
            />
          </div>

          {/* Price */}
          {isPending ? (
            <div>
              <label
                htmlFor="quote-amount"
                className="text-sm font-medium text-gray-700"
              >
                Quoted Amount
              </label>

              <div className="mt-2 flex rounded-lg border border-gray-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
                <span className="flex items-center border-r border-gray-200 px-4 text-sm text-gray-500">
                  ₹
                </span>

                <input
                  id="quote-amount"
                  type="number"
                  min="0"
                  value={amount}
                  onChange={(event) =>
                    setAmount(event.target.value)
                  }
                  placeholder="Enter amount"
                  className="w-full rounded-r-lg px-4 py-3 text-sm outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs text-gray-500">
                Quoted Amount
              </p>

              <p className="mt-1 text-lg font-bold text-gray-900">
                {quote.amount || "Not available"}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        {isPending && (
          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 px-5 py-5 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onReject}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <X size={16} />
              Reject
            </button>

            <button
              type="button"
              disabled={!amount}
              onClick={() => onApprove(`₹${amount}`)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={16} />
              Approve Quote
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: QuoteStatus;
}) {
  return (
    <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
      {status}
    </span>
  );
}