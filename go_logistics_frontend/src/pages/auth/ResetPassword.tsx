<<<<<<< HEAD
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
=======
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { OtpChannel } from "../../services/authService";
>>>>>>> agents/help-me-fix-describe-the-bug-in-this
import { resetPassword } from "../../services/authService";

export default function ResetPassword() {
  const navigate = useNavigate();
<<<<<<< HEAD
  const location = useLocation();

  const resetToken =
  location.state?.resetToken ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters"
      );
=======
  const [searchParams] = useSearchParams();
  const contact = searchParams.get("contact") || "";
  const channel = (searchParams.get("channel") as OtpChannel) || "EMAIL";
  const otp = searchParams.get("otp") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!contact || !otp) {
      setError("Missing reset token data. Please request a new password reset.");
>>>>>>> agents/help-me-fix-describe-the-bug-in-this
      return;
    }

    if (password !== confirmPassword) {
<<<<<<< HEAD
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

     await resetPassword(
     resetToken,
     password
   ); 

      navigate("/login", {
        state: {
          message:
            "Password reset successfully. Please login.",
        },
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to reset password"
      );
    } finally {
      setLoading(false);
=======
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword(contact, otp, password, channel);
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset password.");
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
          Reset Password
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Create a new password for your account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>

            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value
                )
              }
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Updating..."
              : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
=======
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Security</p>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">Reset your password</h1>
        <p className="mt-3 text-sm text-gray-600">
          Choose a secure new password for your account.
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">New password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={8}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {isSubmitting ? "Updating..." : "Update password"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">Back to login</Link>
        </div>
      </div>
    </div>
  );
}
>>>>>>> agents/help-me-fix-describe-the-bug-in-this
