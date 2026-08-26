import { Link } from "react-router-dom";

export default function VerifyEmail() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Verification</p>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">Verify your email</h1>
        <p className="mt-3 text-sm text-gray-600">
          We sent a verification link to your email address. Please click it to activate your account.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link to="/login" className="rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700">
            Back to login
          </Link>
          <Link to="/register" className="rounded-lg border border-gray-300 px-5 py-3 text-center text-sm font-semibold text-gray-700 hover:border-gray-400 hover:bg-gray-50">
            Create another account
          </Link>
        </div>
      </div>
    </div>
  );
}
