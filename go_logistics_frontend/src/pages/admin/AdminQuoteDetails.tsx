import {
  ArrowLeft,
  Check,
  Clock3,
  Download,
  FileText,
  MapPin,
  Package,
  Truck,
  User,
  
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import QuoteHistory from "../../components/quotes/QuoteHistory";
import type { QuoteHistoryEntry } from "../../components/quotes/QuoteHistory";
import { downloadQuotePdf } from "../../utils/quotePdf";
import { useEffect, useState } from "react";
type QuoteStatus = "Pending" | "Approved" | "Rejected";

interface Quote {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  origin: string;
  destination: string;
  cargo: string;
  weight: string;
  containerSize: string;
  vehicle: string;
  price: string;
  requestedDate: string;
  status: QuoteStatus;
}
const quoteData: Record<string, Quote> = {
  QT10001: {
    id: "QT10001",
    customerName: "Rahul Sharma",
    customerEmail: "rahul@example.com",
    customerPhone: "+91 98765 43210",
    origin: "Pune, Maharashtra",
    destination: "Mumbai, Maharashtra",
    cargo: "Commercial Goods",
    weight: "850 kg",
    containerSize: "20 ft",
    vehicle: "Truck",
    price: "₹18,500",
    requestedDate: "Aug 20, 2026",
    status: "Approved",
  },

  QT10002: {
    id: "QT10002",
    customerName: "Priya Enterprises",
    customerEmail: "priya@example.com",
    customerPhone: "+91 98765 12345",
    origin: "Pune, Maharashtra",
    destination: "Nagpur, Maharashtra",
    cargo: "Industrial Equipment",
    weight: "1,200 kg",
    containerSize: "32 ft",
    vehicle: "Container Truck",
    price: "₹32,000",
    requestedDate: "Aug 22, 2026",
    status: "Pending",
  },

  QT10003: {
    id: "QT10003",
    customerName: "Amit Kumar",
    customerEmail: "amit@example.com",
    customerPhone: "+91 99887 66554",
    origin: "Mumbai, Maharashtra",
    destination: "Pune, Maharashtra",
    cargo: "General Cargo",
    weight: "450 kg",
    containerSize: "14 ft",
    vehicle: "Mini Truck",
    price: "₹12,500",
    requestedDate: "Aug 18, 2026",
    status: "Approved",
  },
};
const quoteHistory: QuoteHistoryEntry[] = [
  {
    status: "Requested",
    description:
      "Customer submitted a transportation quote request.",
    date: "Aug 20, 2026 · 09:30 AM",
  },
  {
    status: "Reviewed",
    description:
      "Quote was reviewed by the administration team.",
    date: "Aug 20, 2026 · 11:15 AM",
  },
  {
    status: "Approved",
    description:
      "The quoted transportation price was approved.",
    date: "Aug 20, 2026 · 02:30 PM",
  },
];
export default function AdminQuoteDetails() {
  const { id } = useParams();

  const quote = id ? quoteData[id] : undefined;

  const [status, setStatus] = useState<QuoteStatus>(
    quote?.status ?? "Pending"
  );

  useEffect(() => {
    if (quote) {
      setStatus(quote.status);
    }
  }, [quote]);

  if (!quote) {
    return <QuoteNotFound />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Back */}
      <Link
        to="/admin/quotes"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back to Quotes
      </Link>

      {/* Header */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Quote Details
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {quote.id}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Requested on {quote.requestedDate}
          </p>
        </div>

      <StatusBadge status={status} />  
      </div>

      {/* Customer */}
      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <SectionTitle
          icon={<User size={18} />}
          title="Customer Details"
        />

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <InfoRow
            label="Name"
            value={quote.customerName}
          />

          <InfoRow
            label="Email"
            value={quote.customerEmail}
          />

          <InfoRow
            label="Phone"
            value={quote.customerPhone}
          />
        </div>
      </section>

      {/* Route */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <SectionTitle
          icon={<MapPin size={18} />}
          title="Transportation Route"
        />

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <Location
            label="Origin"
            location={quote.origin}
          />

          <div className="hidden md:flex items-center gap-2">
            <div className="h-px w-20 bg-gray-300" />

            <Truck
              size={20}
              className="text-blue-600"
            />

            <div className="h-px w-20 bg-gray-300" />
          </div>

          <Location
            label="Destination"
            location={quote.destination}
          />
        </div>
      </section>

      {/* Cargo */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <SectionTitle
            icon={<Package size={18} />}
            title="Cargo Details"
          />

          <div className="mt-6 divide-y divide-gray-100">
            <InfoRow
              label="Cargo Type"
              value={quote.cargo}
            />

            <InfoRow
              label="Weight"
              value={quote.weight}
            />

            <InfoRow
              label="Container Size"
              value={quote.containerSize}
            />
          </div>
        </section>

        {/* Vehicle + Price */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          <SectionTitle
            icon={<Truck size={18} />}
            title="Transportation"
          />

          <div className="mt-6 divide-y divide-gray-100">
            <InfoRow
              label="Vehicle"
              value={quote.vehicle}
            />

            <InfoRow
              label="Container Size"
              value={quote.containerSize}
            />

            <div className="flex items-center justify-between gap-4 py-4">
              <p className="text-sm text-gray-500">
                Quoted Price
              </p>

              <p className="text-xl font-bold text-gray-900">
                {quote.price}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* History */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
         <div className="flex items-center gap-2">
    <Clock3
      size={18}
      className="text-blue-600"
    />

    <h2 className="font-semibold text-gray-900">
      Quote History
    </h2>
  </div>

  <QuoteHistory history={quoteHistory} />

        <div className="mt-6">
          <HistoryItem
            title="Quote Requested"
            description="Customer submitted a transportation quote request."
            date="Aug 20, 2026 · 09:30 AM"
            completed
          />

          <HistoryItem
            title="Quote Reviewed"
            description="Quote was reviewed by the administration team."
            date="Aug 20, 2026 · 11:15 AM"
            completed
          />

          <HistoryItem
            title="Quote Approved"
            description="The quoted transportation price was approved."
            date="Aug 20, 2026 · 02:30 PM"
            completed={status === "Approved"}
            last
          />
        </div>
      </section>

      {/* Actions */}
<section className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5 sm:p-6">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 className="font-semibold text-gray-900">
        Quote Actions
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Manage this quote request.
      </p>
    </div>

    <div className="flex flex-col gap-3 sm:flex-row">
      {/* Download PDF */}
      <button
        type="button"
        onClick={() =>
          downloadQuotePdf({
            id: quote.id,
            customerName: quote.customerName,
            customerEmail: quote.customerEmail,
            origin: quote.origin,
            destination: quote.destination,
            cargo: quote.cargo,
            weight: quote.weight,
            containerSize: quote.containerSize,
            vehicle: quote.vehicle,
            price: quote.price,
            requestedDate: quote.requestedDate,
            status,
          })
        }
        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        <Download size={16} />
        Download PDF
      </button>

      {/* Approve / Reject */}
      {status === "Pending" && (
        <>
          <button
            type="button"
            onClick={() => setStatus("Rejected")}
            className="rounded-lg border border-red-300 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Reject Quote
          </button>

          <button
            type="button"
            onClick={() => setStatus("Approved")}
            className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700"
          >
            Approve Quote
          </button>
        </>
      )}
    </div>
  </div>
</section>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-blue-600">{icon}</span>

      <h2 className="font-semibold text-gray-900">
        {title}
      </h2>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="text-right text-sm font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}

function Location({
  label,
  location,
}: {
  label: string;
  location: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-2 text-base font-semibold text-gray-900">
        {location}
      </p>
    </div>
  );
}

function HistoryItem({
  title,
  description,
  date,
  completed,
  last = false,
}: {
  title: string;
  description: string;
  date: string;
  completed: boolean;
  last?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            completed
              ? "bg-blue-600 text-white"
              : "border border-gray-300 bg-white text-gray-400",
          ].join(" ")}
        >
          {completed ? (
            <Check size={15} />
          ) : (
            <Clock3 size={14} />
          )}
        </div>

        {!last && (
          <div className="mt-1 h-12 w-px bg-gray-200" />
        )}
      </div>

      <div className={last ? "pb-0" : "pb-4"}>
        <p className="text-sm font-semibold text-gray-900">
          {title}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {description}
        </p>

        <p className="mt-1.5 text-xs font-medium text-gray-400">
          {date}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: QuoteStatus;
}) {
  const classes =
    status === "Approved"
      ? "bg-green-50 text-green-700"
      : status === "Rejected"
        ? "bg-red-50 text-red-700"
        : "bg-yellow-50 text-yellow-700";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${classes}`}
    >
      {status}
    </span>
  );
}

function QuoteNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <FileText
        size={40}
        className="mx-auto text-gray-400"
      />

      <h1 className="mt-4 text-xl font-bold text-gray-900">
        Quote not found
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        The quote you're looking for doesn't exist.
      </p>

      <Link
        to="/admin/quotes"
        className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Back to Quotes
      </Link>
    </div>
  );
}