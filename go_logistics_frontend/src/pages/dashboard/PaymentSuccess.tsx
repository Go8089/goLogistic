import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function PaymentSuccess() {
  const location = useLocation();

  const state = location.state as {
    quoteId?: string;
    bookingCode?: string;
    amount?: string;
    paymentMethod?: string;
    transactionId?: string;
  } | null;

  return (
    <div className="mx-auto flex max-w-2xl justify-center px-4 py-12 sm:px-6 sm:py-20">
      <div className="w-full rounded-xl border border-gray-200 bg-white p-6 text-center sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <CheckCircle2 size={28} />
        </div>

        <p className="mt-6 text-sm font-medium text-blue-600">Payment Successful</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Booking payment completed</h1>
        <p className="mt-3 text-sm leading-6 text-gray-500">Your payment has been successfully processed. Your transportation booking will now be confirmed.</p>

        <div className="mt-7 divide-y divide-gray-100 rounded-lg border border-gray-200 text-left">
          <Row label="Booking ID" value={state?.bookingCode ?? "N/A"} />
          <Row label="Quote ID" value={state?.quoteId ?? "N/A"} />
          <Row label="Amount Paid" value={state?.amount ?? "N/A"} />
          <Row label="Payment Method" value={state?.paymentMethod ?? "N/A"} />
          <Row label="Transaction ID" value={state?.transactionId ?? "N/A"} />
        </div>

        <Link to="/dashboard/shipments" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
          View My Shipments
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
