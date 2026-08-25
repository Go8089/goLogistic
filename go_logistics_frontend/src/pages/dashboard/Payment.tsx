import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Landmark,
  Smartphone,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import { createCustomerPayment } from "../../services/customerService";

type PaymentMethod = "UPI" | "CARD" | "NET_BANKING";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as {
    quoteId?: string;
    bookingCode?: string;
    amount?: string;
  } | null;

  const quoteId = state?.quoteId ?? "N/A";
  const bookingCode = state?.bookingCode ?? "N/A";
  const amount = state?.amount ?? "N/A";

  const [method, setMethod] = useState<PaymentMethod>("UPI");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [bank, setBank] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  async function handlePayment() {
    setProcessing(true);
    setError("");

    try {
      const transactionReference = `TXN${Date.now()}`;
      const payment = await createCustomerPayment({
        bookingCode,
        method,
        transactionReference,
        status: "SUCCESS",
      });

      navigate("/dashboard/payment-success", {
        state: {
          quoteId: payment.quoteId || quoteId,
          bookingCode: payment.bookingCode || bookingCode,
          amount: payment.amount ? `₹${Number(payment.amount).toLocaleString("en-IN")}` : amount,
          paymentMethod: payment.method || method,
          transactionId: payment.transactionReference || transactionReference,
        },
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Payment could not be processed.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Link to="/dashboard/quotes" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
        <ArrowLeft size={16} />
        Back to Quotes
      </Link>

      <div className="mt-6">
        <p className="text-sm font-medium text-blue-600">Booking Payment</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Complete Payment</h1>
        <p className="mt-2 text-sm text-gray-500">Complete your payment to confirm the transportation booking.</p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
          <h2 className="font-semibold text-gray-900">Payment Method</h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MethodButton active={method === "UPI"} onClick={() => setMethod("UPI")} icon={<Smartphone size={19} />} title="UPI" />
            <MethodButton active={method === "CARD"} onClick={() => setMethod("CARD")} icon={<CreditCard size={19} />} title="Card" />
            <MethodButton active={method === "NET_BANKING"} onClick={() => setMethod("NET_BANKING")} icon={<Landmark size={19} />} title="Net Banking" />
          </div>

          {method === "UPI" && (
            <div className="mt-7">
              <label htmlFor="upi" className="text-sm font-medium text-gray-700">UPI ID</label>
              <input id="upi" value={upiId} onChange={(event) => setUpiId(event.target.value)} placeholder="example@upi" className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
              <p className="mt-2 text-xs text-gray-400">Enter your UPI ID to continue.</p>
            </div>
          )}

          {method === "CARD" && (
            <div className="mt-7 space-y-4">
              <div>
                <label htmlFor="cardName" className="text-sm font-medium text-gray-700">Cardholder Name</label>
                <input id="cardName" value={cardName} onChange={(event) => setCardName(event.target.value)} placeholder="Name on card" className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">Card Number</label>
                <input id="cardNumber" value={cardNumber} onChange={(event) => setCardNumber(event.target.value)} inputMode="numeric" maxLength={19} placeholder="1234 5678 9012 3456" className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry" className="text-sm font-medium text-gray-700">Expiry</label>
                  <input id="expiry" value={expiry} onChange={(event) => setExpiry(event.target.value)} placeholder="MM/YY" maxLength={5} className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div>
                  <label htmlFor="cvv" className="text-sm font-medium text-gray-700">CVV</label>
                  <input id="cvv" type="password" value={cvv} onChange={(event) => setCvv(event.target.value)} inputMode="numeric" maxLength={4} placeholder="•••" className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>
            </div>
          )}

          {method === "NET_BANKING" && (
            <div className="mt-7">
              <label htmlFor="bank" className="text-sm font-medium text-gray-700">Bank Name</label>
              <input id="bank" value={bank} onChange={(event) => setBank(event.target.value)} placeholder="Your bank name" className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100" />
            </div>
          )}
        </section>

        <aside className="rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-blue-600" size={18} />
            <h2 className="font-semibold text-gray-900">Payment Summary</h2>
          </div>

          <div className="mt-6 space-y-4 text-sm text-gray-600">
            <SummaryRow label="Booking ID" value={bookingCode} />
            <SummaryRow label="Quote ID" value={quoteId} />
            <SummaryRow label="Amount" value={amount} />
            <SummaryRow label="Payment Method" value={method} />
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button type="button" onClick={handlePayment} disabled={processing} className="mt-7 w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">
            {processing ? "Processing..." : "Pay Now"}
          </button>
        </aside>
      </div>
    </div>
  );
}

function MethodButton({
  active,
  onClick,
  icon,
  title,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${
        active ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      {icon}
      {title}
    </button>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span>{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
