import { useState } from "react";
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
    }
  };

  return (
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