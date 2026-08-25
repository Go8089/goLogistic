import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { adminLogin } from "../../services/authService";
export default function AdminLogin() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
 const [isSubmitting, setIsSubmitting] = useState(false);

 const handleSubmit = async (
   event: React.FormEvent
 ) => {
   event.preventDefault();
   setError("");
   setIsSubmitting(true);

   try {
     const data = await adminLogin(email, password);

     localStorage.setItem("token", data.token);
     localStorage.setItem(
       "user",
       JSON.stringify({
         id: data.userId,
         name: data.name,
         email: data.email,
         role: data.role,
       })
     );

     navigate("/admin");
   } catch (error) {
     setError(
       error instanceof Error
         ? error.message
         : "Admin login failed"
     );
   } finally {
     setIsSubmitting(false);
   }
 };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* Brand */}
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
              <ShieldCheck size={22} />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Admin Portal
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Sign in to manage transportation operations.
            </p>
          </div>

          {/* Form */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            {error && (
             <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
            )}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Admin email
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="admin@example.com"
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <div className="relative mt-2">
                  <input
                    id="password"
                    type={
                      showPassword ? "text" : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-11 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {isSubmitting ? "Signing in..." : "Admin Sign In"}
              </button>
            </form>

            <div className="mt-6 border-t border-gray-100 pt-5 text-center">
              <Link
                to="/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Customer Login
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}