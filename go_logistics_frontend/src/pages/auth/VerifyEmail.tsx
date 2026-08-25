import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { verifyEmail, resendEmailOtp, } from "../../services/authService";

export default function VerifyEmail() {
  const navigate = useNavigate();
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

      await verifyEmail(email, otp);

      navigate("/login", {
        state: {
          message: "Email verified. You can now login.",
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

  const handleResend = async () => {
  try {
    setError("");

    await resendEmailOtp(email);

    setError("A new OTP has been sent.");
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Failed to resend OTP"
    );
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Verify Email
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Enter the 6-digit OTP sent to:
        </p>

        <p className="mt-1 font-medium text-gray-900">
          {email}
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
                event.target.value.replace(/\D/g, "")
              )
            }
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-lg tracking-[0.4em] outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            placeholder="000000"
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
            {loading ? "Verifying..." : "Verify Email"}
          </button>
         <button
  type="button"
  onClick={handleResend}
  className="mt-3 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
>
  Resend OTP
</button> 
        </form>
      </div>
    </div>
  );
}