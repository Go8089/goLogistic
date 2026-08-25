import { ArrowLeft, CheckCircle2, MapPin, Truck } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

export default function BookingConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation() as {
    state?: {
      booking?: {
        bookingId?: string;
        quoteId?: string;
        route?: string;
        vehicle?: string;
        amount?: number | string;
        status?: string;
        bookingDate?: string;
      };
      quote?: {
        origin?: string;
        destination?: string;
        cargo?: string;
        weight?: string;
        containerSize?: string;
        requestedVehicle?: string;
      };
    };
  };

  const booking = {
    bookingId: state?.booking?.bookingId ?? "N/A",
    quoteId: state?.booking?.quoteId ?? id ?? "N/A",
    pickupLocation: state?.quote?.origin ?? "N/A",
    deliveryLocation: state?.quote?.destination ?? "N/A",
    cargoType: state?.quote?.cargo ?? "N/A",
    weight: state?.quote?.weight ?? "N/A",
    vehicleCategory: state?.quote?.requestedVehicle ?? state?.booking?.vehicle ?? "N/A",
    bodyType: state?.quote?.containerSize ?? "N/A",
    containerSize: state?.quote?.containerSize ?? "N/A",
    pickupDate: state?.booking?.bookingDate ?? "N/A",
    totalAmount: state?.booking?.amount ? `₹${Number(state.booking.amount).toLocaleString("en-IN")}` : "N/A",
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <Link to={`/dashboard/quotes/${booking.quoteId}`} className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900">
        <ArrowLeft size={16} />
        Back to Quote
      </Link>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 text-center sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <CheckCircle2 size={28} />
        </div>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Booking Confirmed</h1>
        <p className="mt-2 text-sm text-gray-500">Your transportation booking has been successfully created.</p>

        <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2">
          <span className="text-xs text-gray-500">Booking ID</span>
          <span className="text-sm font-bold text-gray-900">{booking.bookingId}</span>
        </div>
      </div>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Transportation Route</h2>
            <p className="mt-1 text-sm text-gray-500">Your confirmed pickup and delivery locations.</p>
          </div>
          <MapPin size={21} className="text-gray-400" />
        </div>

        <div className="mt-7 grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <Location label="Pickup" location={booking.pickupLocation} />
          <div className="hidden h-px w-16 bg-gray-200 sm:block" />
          <Location label="Delivery" location={booking.deliveryLocation} />
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Booking Details</h2>
            <p className="mt-1 text-sm text-gray-500">Confirmed transportation requirements.</p>
          </div>
          <Truck size={21} className="text-gray-400" />
        </div>

        <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          <Detail label="Cargo Type" value={booking.cargoType} />
          <Detail label="Weight" value={booking.weight} />
          <Detail label="Vehicle Category" value={booking.vehicleCategory} />
          <Detail label="Body / Container Type" value={booking.bodyType} />
          <Detail label="Container / Body Size" value={booking.containerSize} />
          <Detail label="Pickup Date" value={booking.pickupDate} />
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-7">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Total Transportation Amount</span>
          <span className="text-xl font-bold text-gray-900">{booking.totalAmount}</span>
        </div>
      </section>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => navigate("/dashboard/payment", {
            state: {
              bookingCode: booking.bookingId,
              quoteId: booking.quoteId,
              amount: String(state?.booking?.amount ?? "0"),
            },
          })}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Proceed to Payment
        </button>
        <Link to="/dashboard/shipments" className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">View My Shipments</Link>
        <Link to="/dashboard" className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50">Go to Dashboard</Link>
      </div>
    </div>
  );
}

function Location({ label, location }: { label: string; location: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-2 text-base font-semibold text-gray-900">{location}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-gray-900">{value}</p>
    </div>
  );
}
