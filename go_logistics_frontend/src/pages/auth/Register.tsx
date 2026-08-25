import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Truck } from "lucide-react";
import { register } from "../../services/authService";


export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

 const [error, setError] = useState("");


const handleSubmit = async (
  event: React.FormEvent
) => {
  event.preventDefault();

  if (form.password !== form.confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
      await register({
  name: form.name,
  email: form.email,
  password: form.password,
  phone: `+91${form.phone}`,
});

navigate("/verify-email", {
  state: {
    email: form.email,
    phone: `+91${form.phone}`,
  },
});

navigate("/verify-phone", {
  state: {
    phone: location.state?.phone,
  },
});
navigate("/login");
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Registration failed"
    );
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Brand */}
          <div className="mb-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Truck size={21} />
              </div>

              <span className="text-xl font-bold text-gray-900">
                TransportCo
              </span>
            </Link>

            <h1 className="mt-8 text-2xl font-bold text-gray-900">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Register to book and track road transportation.
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
              className="space-y-4"
            >
              <Field
                label="Full name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
              />

              <Field
                label="Email address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />

              <div>
  <label
    htmlFor="phone"
    className="block text-sm font-medium text-gray-700"
  >
    Phone Number
  </label>

  <div className="mt-2 flex">
    <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 text-sm text-gray-600">
      +91
    </span>

    <input
      id="phone"
      name="phone"
      type="tel"
      inputMode="numeric"
      maxLength={10}
      value={form.phone}
      onChange={(event) => {
        const value = event.target.value
          .replace(/\D/g, "")
          .slice(0, 10);

        setForm((current) => ({
          ...current,
          phone: value,
        }));
      }}
      placeholder="9876543210"
      className="w-full rounded-r-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
    />
  </div>
</div>

              {/* Password */}
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    minLength={8}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-11 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm password
                </label>

                <div className="relative mt-2">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    minLength={8}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-11 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) => !value
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Create Account
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Road transportation services
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}