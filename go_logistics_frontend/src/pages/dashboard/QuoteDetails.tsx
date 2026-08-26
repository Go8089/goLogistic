import { ArrowLeft, CheckCircle2, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { acceptQuote, getQuoteById, type CustomerQuote } from "../../services/customerService";

export default function QuoteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quote, setQuote] = useState<CustomerQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    getQuoteById(id)
      .then((data) => setQuote(data))
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : "Unable to load quote");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAccept = async () => {
    if (!id) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const booking = await acceptQuote(id);
      navigate(`/dashboard/quotes/${id}/book`, {
        state: {
          booking,
          quote,
        },
      });
    } catch (acceptError) {
      setError(acceptError instanceof Error ? acceptError.message : "Unable to accept this quote");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="px-4 py-10 text-sm text-gray-500">Loading quote details...</div>;
  }

  if (!quote) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Link to="/dashboard/quotes" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900">
          <ArrowLeft size={16} />
          Back to My Quotes
        </Link>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-red-600">{error || "Quote details were not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Link
        to="/dashboard/quotes"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back to My Quotes
      </Link>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ClipboardList className="text-blue-600" size={20} />
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quote {quote.id}</h1>
          </div>
          <StatusBadge status={quote.status} />
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <InfoRow label="Origin" value={quote.origin} />
          <InfoRow label="Destination" value={quote.destination} />
          <InfoRow label="Cargo" value={quote.cargo} />
          <InfoRow label="Weight" value={quote.weight} />
          <InfoRow label="Vehicle" value={quote.requestedVehicle} />
          <InfoRow label="Container size" value={quote.containerSize} />
          <InfoRow label="Requested" value={new Date(quote.requestedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} />
          <InfoRow label="Amount" value={`₹${Number(quote.amount).toLocaleString("en-IN")}`} />
        </div>

        {error && (
          <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {quote.status === "APPROVED" && (
          <div className="mt-6 flex items-center justify-end">
            <button
              type="button"
              onClick={handleAccept}
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              <CheckCircle2 size={16} />
              {submitting ? "Confirming booking..." : "Accept and Book Quote"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700",
    APPROVED: "bg-green-50 text-green-700",
    REJECTED: "bg-red-50 text-red-700",
    EXPIRED: "bg-gray-200 text-gray-700",
  };

  const labels: Record<string, string> = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    EXPIRED: "Expired",
  };

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] ?? "bg-gray-100 text-gray-700"}`}>{labels[status] ?? status}</span>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}
