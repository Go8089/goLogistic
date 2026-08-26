<<<<<<< HEAD
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
=======
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { OtpChannel } from "../../services/authService";
>>>>>>> agents/help-me-fix-describe-the-bug-in-this
import { verifyResetOtp } from "../../services/authService";

export default function VerifyResetOtp() {
  const navigate = useNavigate();
<<<<<<< HEAD
  const location = useLocation();

  const email = location.state?.email ?? "";

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

      await verifyResetOtp(email, otp);

   const data = await verifyResetOtp(email, otp);

 navigate("/reset-password", {
  state: {
    resetToken: data.resetToken,
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
=======
  const [searchParams] = useSearchParams();
  const contact = searchParams.get("contact") || "";
  const channel = (searchParams.get("channel") as OtpChannel) || "EMAIL";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!contact) {
      setError("Contact is missing. Please request a new code.");
      return;
    }

    setIsSubmitting(true);

    try {
      await verifyResetOtp(contact, otp.trim(), channel);
      navigate(
        `/reset-password?contact=${encodeURIComponent(contact)}&channel=${channel}&otp=${encodeURIComponent(otp.trim())}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to verify OTP.");
    } finally {
      setIsSubmitting(false);
>>>>>>> agents/help-me-fix-describe-the-bug-in-this
    }
  };

  return (
<<<<<<< HEAD
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Verify OTP
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter the OTP sent to:
        </p>

        <p className="mt-1 font-medium text-gray-900">
          {email}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6"
        >
          <input
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
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-lg tracking-[0.4em] outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
=======
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">OTP verification</p>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">Verify your reset code</h1>
        <p className="mt-3 text-sm text-gray-600">
          Enter the six-digit code sent to {contact || "your selected contact"}.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="otp" className="text-sm font-medium text-gray-700">OTP</label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder="123456"
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <Link to="/forgot-password" className="font-semibold text-blue-600 hover:text-blue-700">Resend code</Link>
        </div>
      </div>
    </div>
  );
}
>>>>>>> agents/help-me-fix-describe-the-bug-in-this
