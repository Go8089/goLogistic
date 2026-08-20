import { ArrowLeft, Clock3, MapPin, Truck, Download } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import QuoteHistory from "../../components/quotes/QuoteHistory";
import type { QuoteHistoryEntry } from "../../components/quotes/QuoteHistory";
import { downloadQuotePdf } from "../../utils/quotePdf";

interface Quote {
  id: string;
  status: "Pending" | "Approved" | "Rejected";
  pickupLocation: string;
  deliveryLocation: string;
  cargoType: string;
  weight: string;
  vehicleCategory: string;
  bodyType: string;
  containerSize: string;
  pickupDate: string;
  validUntil: string;
  transportationCharge: number;
  handlingCharge: number;
  tollCharge: number;
  otherCharges: number;
}

const mockQuote: Quote = {
  id: "QT10001",
  status: "Approved",
  pickupLocation: "Pune, Maharashtra",
  deliveryLocation: "Mumbai, Maharashtra",
  cargoType: "Commercial Goods",
  weight: "850 kg",
  vehicleCategory: "Heavy Truck",
  bodyType: "Container",
  containerSize: "32 ft",
  pickupDate: "25 Aug 2026",
  validUntil: "24 Aug 2026",
  transportationCharge: 15000,
  handlingCharge: 1000,
  tollCharge: 1500,
  otherCharges: 500,
};
const quoteHistory: QuoteHistoryEntry[] = [
  {
    status: "Requested",
    description:
      "Your quote request was submitted successfully.",
    date: "Aug 20, 2026 · 09:30 AM",
  },
  {
    status: "Reviewed",
    description:
      "Your quote request has been reviewed.",
    date: "Aug 20, 2026 · 11:15 AM",
  },
  {
    status: "Approved",
    description:
      "Your transportation quote has been approved.",
    date: "Aug 20, 2026 · 02:30 PM",
  },
];
export default function QuoteDetails() {
  const { id } = useParams();

  // Later this will come from the backend using `id`.
  const quote = {
    ...mockQuote,
    id: id || mockQuote.id,
  };

  const total =
    quote.transportationCharge +
    quote.handlingCharge +
    quote.tollCharge +
    quote.otherCharges;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Back */}
      <Link
        to="/dashboard/quotes"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back to My Quotes
      </Link>

      {/* Header */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Quote {quote.id}
            </h1>

            <StatusBadge status={quote.status} />
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Review your transportation quote before booking.
          </p>
        </div>
      </div>

      {/* Route */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Transportation Route
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your requested pickup and delivery route.
            </p>
          </div>

          <MapPin
            size={21}
            className="text-gray-400"
          />
        </div>

        <div className="mt-7 grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <Location
            label="Pickup"
            location={quote.pickupLocation}
          />

          <div className="hidden h-px w-16 bg-gray-200 sm:block" />

          <Location
            label="Delivery"
            location={quote.deliveryLocation}
          />
        </div>
      </section>

      {/* Shipment + Vehicle */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Cargo */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
          <h2 className="text-lg font-semibold text-gray-900">
            Cargo Details
          </h2>

          <div className="mt-6 space-y-4">
            <DetailRow
              label="Cargo Type"
              value={quote.cargoType}
            />

            <DetailRow
              label="Approximate Weight"
              value={quote.weight}
            />

            <DetailRow
              label="Pickup Date"
              value={quote.pickupDate}
            />
          </div>
        </section>

        {/* Vehicle */}
        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Vehicle Requirement
            </h2>

            <Truck
              size={21}
              className="text-gray-400"
            />
          </div>

          <div className="mt-6 space-y-4">
            <DetailRow
              label="Vehicle Category"
              value={quote.vehicleCategory}
            />

            <DetailRow
              label="Body / Container Type"
              value={quote.bodyType}
            />

            <DetailRow
              label="Container / Body Size"
              value={quote.containerSize}
            />
          </div>
        </section>
      </div>

      {/* Price */}
      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
         <div className="flex items-center gap-2">
         <Clock3
        size={18}
        className="text-blue-600"  />

        <h2 className="font-semibold text-gray-900">
          Quote History
        </h2>
        </div>

          <QuoteHistory history={quoteHistory} />
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Quote Breakdown
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Charges included in your transportation quote.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <PriceRow
            label="Transportation"
            amount={quote.transportationCharge}
          />

          <PriceRow
            label="Loading / Handling"
            amount={quote.handlingCharge}
          />

          <PriceRow
            label="Toll Estimate"
            amount={quote.tollCharge}
          />

          <PriceRow
            label="Other Charges"
            amount={quote.otherCharges}
          />
        </div>

        <div className="mt-6 border-t border-gray-200 pt-5">
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-gray-900">
              Total Amount
            </span>

            <span className="text-xl font-bold text-gray-900">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </section>

      {/* Validity */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <Clock3
          size={19}
          className="mt-0.5 shrink-0 text-gray-500"
        />

        <div>
          <p className="text-sm font-medium text-gray-900">
            Quote valid until {quote.validUntil}
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-500">
            The quoted amount may change after the validity period.
          </p>
        </div>
      </div>

      {/* Actions */}
      {quote.status === "Approved" && (
        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">
                Ready to proceed?
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Accept this quote to continue with your booking.
              </p>
            </div>
             <button
  type="button"
  onClick={() =>
    downloadQuotePdf({
      id: quote.id,
      origin: quote.pickupLocation,
      destination: quote.deliveryLocation,
      cargo: quote.cargoType,
      weight: quote.weight,
      containerSize: quote.containerSize,
      vehicle: `${quote.vehicleCategory} - ${quote.bodyType}`,
      price: `₹${(
        quote.transportationCharge +
        quote.handlingCharge +
        quote.tollCharge +
        quote.otherCharges
      ).toLocaleString("en-IN")}`,
      requestedDate: quote.pickupDate,
      status: quote.status,
    })
  }
  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
>
  <Download size={16} />
  Download PDF
</button>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Reject Quote
              </button>

              <Link
                to={`/dashboard/quotes/${quote.id}/book`}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Accept & Book
              </Link>

            </div>
          </div>
        </section>
      )}
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
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-base font-semibold text-gray-900">
        {location}
      </p>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <span className="text-sm text-gray-500">
        {label}
      </span>

      <span className="text-right text-sm font-medium text-gray-900">
        {value}
      </span>
    </div>
  );
}

function PriceRow({
  label,
  amount,
}: {
  label: string;
  amount: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-gray-600">
        {label}
      </span>

      <span className="text-sm font-medium text-gray-900">
        ₹{amount.toLocaleString("en-IN")}
      </span>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: Quote["status"];
}) {
  const config = {
    Pending: {
      label: "Pending",
      className: "bg-blue-50 text-blue-700",
    },
    Approved: {
      label: "Approved",
      className: "bg-green-50 text-green-700",
    },
    Rejected: {
      label: "Rejected",
      className: "bg-red-50 text-red-700",
    },
  };

  const current = config[status];

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
}