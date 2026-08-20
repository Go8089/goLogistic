import { FileText, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

type QuoteStatus =
  | "Pending"
  | "Approved"
  | "Rejected";

interface Quote {
  id: string;
  origin: string;
  destination: string;
  cargo: string;
  weight: string;
  requestedDate: string;
  amount: string;
  status: QuoteStatus;
}

const quotes: Quote[] = [
  {
    id: "QT10001",
    origin: "Pune, Maharashtra",
    destination: "Mumbai, Maharashtra",
    cargo: "Commercial Goods",
    weight: "850 kg",
    requestedDate: "Aug 20, 2026",
    amount: "₹18,500",
    status: "Approved",
  },
  {
    id: "QT10002",
    origin: "Pune, Maharashtra",
    destination: "Nagpur, Maharashtra",
    cargo: "Industrial Equipment",
    weight: "1,200 kg",
    requestedDate: "Aug 22, 2026",
    amount: "₹32,000",
    status: "Pending",
  },
  {
    id: "QT10003",
    origin: "Mumbai, Maharashtra",
    destination: "Pune, Maharashtra",
    cargo: "General Cargo",
    weight: "450 kg",
    requestedDate: "Aug 18, 2026",
    amount: "₹12,500",
    status: "Approved",
  },
  {
    id: "QT10004",
    origin: "Pune, Maharashtra",
    destination: "Nashik, Maharashtra",
    cargo: "Commercial Goods",
    weight: "700 kg",
    requestedDate: "Aug 15, 2026",
    amount: "₹15,800",
    status: "Rejected",
  },
];

export default function Quotes() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      const query = search.toLowerCase();

      const matchesSearch =
        quote.id.toLowerCase().includes(query) ||
        quote.origin.toLowerCase().includes(query) ||
        quote.destination.toLowerCase().includes(query);

      const matchesStatus =
        status === "All" || quote.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Quotations
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            My Quotes
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            View and manage your transportation quote requests.
          </p>
        </div>

        <Link
          to="/quote"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Request a Quote
        </Link>
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
              placeholder="Search quote ID, origin or destination"
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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
        quotes
      </p>

      {/* Desktop */}
      {filteredQuotes.length > 0 ? (
        <div className="mt-3 hidden overflow-hidden rounded-xl border border-gray-200 bg-white md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Quote ID
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Route
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Cargo
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

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
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
                        {quote.weight}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {quote.requestedDate}
                    </td>

                    <td className="px-6 py-5 text-sm font-semibold text-gray-900">
                      {quote.amount}
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge status={quote.status} />
                    </td>

                    <td className="px-6 py-5 text-right">
                   <Link
                     to={`/dashboard/quotes/${quote.id}`}
                     className="font-medium text-blue-600 hover:text-blue-700"
                    >
                     View Quote
                    </Link>
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
      {filteredQuotes.length > 0 && (
        <div className="mt-3 space-y-3 md:hidden">
          {filteredQuotes.map((quote) => (
            <div
              key={quote.id}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {quote.id}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {quote.requestedDate}
                  </p>
                </div>

                <StatusBadge status={quote.status} />
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Route
                </p>

                <p className="mt-2 text-sm font-medium text-gray-800">
                  {quote.origin}
                </p>

                <p className="my-1 text-xs text-gray-400">
                  ↓
                </p>

                <p className="text-sm font-medium text-gray-800">
                  {quote.destination}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                <div>
                  <p className="text-xs text-gray-400">
                    Cargo
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {quote.cargo}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Weight
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {quote.weight}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Amount
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {quote.amount}
                  </p>
                </div>
              </div>
              <div className="mt-5 border-t border-gray-100 pt-4">
               <Link
                to={`/dashboard/quotes/${quote.id}`}
                className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                View Quote
               </Link>
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
  status: QuoteStatus;
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
        <FileText size={22} />
      </div>

      <h2 className="mt-4 text-sm font-semibold text-gray-900">
        No quotes found
      </h2>

      <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
        Try changing your search or status filter.
      </p>
    </div>
  );
}