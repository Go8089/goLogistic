import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetPassword } from "../../services/authService";

export default function ResetPassword() {
  const navigate = useNavigate();
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
      return;
    }

    if (password !== confirmPassword) {
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
    }
  };

  return (
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