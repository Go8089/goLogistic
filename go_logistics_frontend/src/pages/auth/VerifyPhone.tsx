<<<<<<< HEAD
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { verifyPhone } from "../../services/authService";

export default function VerifyPhone() {
  const navigate = useNavigate();
  const location = useLocation();

  const phone = location.state?.phone ?? "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await verifyPhone(phone, otp);

      navigate("/login", {
        state: {
          message:
            "Phone verified successfully. You can now login.",
        },
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <h1 className="text-2xl font-bold text-gray-900">
          Verify Mobile Number
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter the 6-digit OTP sent to:
        </p>

        <p className="mt-1 font-semibold text-gray-900">
          {phone}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6"
        >
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700"
          >
            OTP
          </label>

          <input
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(event) =>
              setOtp(
                event.target.value
                  .replace(/\D/g, "")
                  .slice(0, 6)
              )
            }
            placeholder="000000"
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-lg tracking-[0.4em] outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />

          {error && (
            <p className="mt-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Mobile"}
          </button>
        </form>
      </div>
    </div>
  );
}
=======
import { Link } from "react-router-dom";

export default function VerifyPhone() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Verification</p>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">Verify your phone number</h1>
        <p className="mt-3 text-sm text-gray-600">
          Enter the OTP sent to your phone to verify your account before proceeding.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link to="/register" className="rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700">
            Back to registration
          </Link>
          <Link to="/login" className="rounded-lg border border-gray-300 px-5 py-3 text-center text-sm font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50">
            Login instead
          </Link>
        </div>
      </div>
    </div>
  );
}
>>>>>>> agents/help-me-fix-describe-the-bug-in-this
