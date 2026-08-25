import { FileText, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import { getMyQuotes, type CustomerQuote } from "../../services/customerService";

type QuoteStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED";

export default function Quotes() {
  const [quotes, setQuotes] = useState<CustomerQuote[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    getMyQuotes()
      .then((items) => {
        if (mounted) {
          setQuotes(items);
          setError("");
        }
      })
      .catch((loadError) => {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load quotes");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      const query = search.toLowerCase();

      const matchesSearch =
        quote.id.toLowerCase().includes(query) ||
        quote.origin.toLowerCase().includes(query) ||
        quote.destination.toLowerCase().includes(query);

      const matchesStatus = status === "All" || quote.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [quotes, search, status]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Quotations</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">My Quotes</h1>
          <p className="mt-2 text-sm text-gray-500">View and manage your transportation quote requests.</p>
        </div>

        <Link
          to="/quote"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Request a Quote
        </Link>
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search quote ID, origin or destination"
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 md:w-48"
          >
            <option value="All">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">Loading your quotes...</p>
      ) : (
        <>
          <p className="mt-6 text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-900">{filteredQuotes.length}</span> quotes
          </p>

          {filteredQuotes.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
              <FileText className="mx-auto text-gray-400" size={28} />
              <p className="mt-4 text-base font-semibold text-gray-900">No quotes yet</p>
              <p className="mt-2 text-sm text-gray-500">Your quote requests will appear here once you submit them.</p>
            </div>
          ) : (
            <div className="mt-3 hidden overflow-hidden rounded-xl border border-gray-200 bg-white md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-left">
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Quote ID</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Route</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Cargo</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Date</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Amount</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuotes.map((quote) => (
                      <tr key={quote.id} className="border-b border-gray-100 last:border-0">
                        <td className="px-6 py-5"><p className="text-sm font-semibold text-gray-900">{quote.id}</p></td>
                        <td className="px-6 py-5"><p className="text-sm font-medium text-gray-800">{quote.origin}</p><p className="mt-1 text-xs text-gray-500">→ {quote.destination}</p></td>
                        <td className="px-6 py-5"><p className="text-sm text-gray-700">{quote.cargo}</p><p className="mt-1 text-xs text-gray-400">{quote.weight}</p></td>
                        <td className="px-6 py-5 text-sm text-gray-600">{new Date(quote.requestedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                        <td className="px-6 py-5 text-sm font-medium text-gray-900">₹{Number(quote.amount).toLocaleString("en-IN")}</td>
                        <td className="px-6 py-5"><StatusBadge status={quote.status} /></td>
                        <td className="px-6 py-5 text-right"><Link to={`/dashboard/quotes/${quote.id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">View</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: QuoteStatus }) {
  const styles: Record<QuoteStatus, string> = {
    PENDING: "bg-yellow-50 text-yellow-700",
    APPROVED: "bg-green-50 text-green-700",
    REJECTED: "bg-red-50 text-red-700",
    EXPIRED: "bg-gray-200 text-gray-700",
  };

  const labels: Record<QuoteStatus, string> = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    EXPIRED: "Expired",
  };

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>{labels[status]}</span>;
}
