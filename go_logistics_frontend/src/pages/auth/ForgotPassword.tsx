import { useState } from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/authService";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await forgotPassword(email);

      navigate("/verify-reset-otp", {
        state: { email },
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to send reset OTP"
      );
    } finally {
      setLoading(false);
=======
import { Link, useNavigate } from "react-router-dom";
import type { OtpChannel } from "../../services/authService";
import { requestPasswordReset } from "../../services/authService";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [contact, setContact] = useState("");
  const [channel, setChannel] = useState<OtpChannel>("EMAIL");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await requestPasswordReset(contact.trim(), channel);
      navigate(
        `/verify-reset-otp?contact=${encodeURIComponent(contact.trim())}&channel=${channel}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send reset OTP.");
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
          Forgot Password?
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter your registered email address. We'll
          send you an OTP to reset your password.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6"
        >
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            placeholder="you@example.com"
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
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
=======
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Account recovery</p>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">Forgot password?</h1>
        <p className="mt-3 text-sm text-gray-600">
          Choose how you want to receive the reset code.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="channel" className="text-sm font-medium text-gray-700">
              Delivery method
            </label>
            <select
              id="channel"
              value={channel}
              onChange={(event) => setChannel(event.target.value as OtpChannel)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="EMAIL">Email</option>
              <option value="PHONE">Mobile number</option>
            </select>
          </div>

          <div>
            <label htmlFor="contact" className="text-sm font-medium text-gray-700">
              {channel === "EMAIL" ? "Email address" : "Mobile number"}
            </label>
            <input
              id="contact"
              type={channel === "EMAIL" ? "email" : "tel"}
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              placeholder={channel === "EMAIL" ? "you@example.com" : "+91 98765 43210"}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {isSubmitting ? "Sending..." : "Send reset OTP"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Remember your password? <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">Login</Link>
        </div>
      </div>
    </div>
  );
}
>>>>>>> agents/help-me-fix-describe-the-bug-in-this
