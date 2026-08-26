import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Button from "../components/Button";
import SectionTitle from "../components/SectionTitle";
import { services } from "../data/services";

const processSteps = [
  {
    number: "01",
    title: "Tell Us Your Requirement",
    description:
      "Share your pickup location, destination, cargo details, and preferred schedule.",
  },
  {
    number: "02",
    title: "We Plan the Transportation",
    description:
      "We identify a suitable road transportation option based on your cargo and route.",
  },
  {
    number: "03",
    title: "Your Cargo Moves",
    description:
      "Your shipment is transported by road according to the agreed transportation plan.",
  },
];

const benefits = [
  "Local and intercity road transportation",
  "Long-distance cargo movement",
  "Multiple vehicle capacities",
  "Commercial and business shipments",
];

export default function Home() {
  const [user, setUser] = useState<{ role?: string; name?: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      setUser(null);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as { role?: string; name?: string };
      setUser(parsedUser);
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  const isLoggedIn = Boolean(user);
  const dashboardPath = user?.role === "ADMIN" ? "/admin" : "/dashboard";
  const dashboardLabel = user?.role === "ADMIN" ? "Open Admin Dashboard" : "Go to Dashboard";

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-50">
        <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          {/* Content */}
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Road Transportation
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Moving your cargo safely and reliably.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
              Reliable road transportation solutions for local,
              intercity, and long-distance cargo movement.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 size={17} className="text-blue-600" />
                Road-only transportation
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle2 size={17} className="text-blue-600" />
                Flexible vehicle options
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80"
                alt="Cargo truck on a road"
                className="h-[360px] w-full object-cover sm:h-[450px] lg:h-[520px]"
              />
            </div>

            {/* Small information card */}
            <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-gray-200 bg-white/95 p-5 shadow-lg backdrop-blur sm:left-auto sm:max-w-xs">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Truck size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Road Cargo Transportation
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Transportation solutions based on your cargo and route.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Our Services"
            title="Road transportation built around your needs"
            description="From smaller local shipments to long-distance cargo, we provide transportation options for different requirements."
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="rounded-xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-gray-900">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {service.description}
                  </p>

                  <Link
                    to="/services"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Learn more
                    <ArrowRight size={15} />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all services
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="border-y border-gray-200 bg-gray-50 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Why Choose Us
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Focused on dependable road transportation.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600">
              We keep transportation simple by focusing on safe cargo
              handling, suitable vehicles, planned routes, and clear
              communication.
            </p>

            <div className="mt-7 space-y-4">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2
                    size={18}
                    className="shrink-0 text-blue-600"
                  />

                  <span className="text-sm text-gray-700">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            <Button
              to="/about"
              variant="secondary"
              className="mt-8"
            >
              About Us
              <ArrowRight size={17} />
            </Button>
          </div>

          <div className="overflow-hidden rounded-2xl bg-gray-200">
            <img
              src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80"
              alt="Truck transporting cargo by road"
              loading="lazy"
              className="h-[380px] w-full object-cover sm:h-[460px]"
            />
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="How It Works"
            title="Simple from pickup to delivery"
            description="Our process is designed to make arranging road transportation straightforward."
          />

          <div className="grid gap-6 md:grid-cols-3">
            {processSteps.map((step) => (
              <div
                key={step.number}
                className="rounded-xl border border-gray-200 p-7"
              >
                <span className="text-sm font-bold tracking-widest text-blue-600">
                  {step.number}
                </span>

                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracking */}
      <section className="border-y border-gray-200 bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <MapPin size={21} />
              </div>

              <h2 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Track your shipment
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
                Have a tracking ID? Check your shipment status and view
                transportation details.
              </p>
            </div>

            <Button to="/tracking">
              Track Shipment
              <ArrowRight size={17} />
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                  Get Started
                </p>

                <h2 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Ready to move your cargo?
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-300">
                  Registration and login are required to book shipments, track cargo, and manage your road transport services with GoLogistic.
                </p>
              </div>

              {isLoggedIn ? (
                <div className="grid w-full max-w-xl gap-3 sm:grid-cols-2">
                  <Link
                    to={dashboardPath}
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                  >
                    {dashboardLabel}
                  </Link>

                  <Link
                    to="/quote"
                    className="inline-flex items-center justify-center rounded-xl border border-gray-600 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-blue-400 hover:bg-blue-500/10"
                  >
                    Book Shipment
                  </Link>
                </div>
              ) : (
                <div className="grid w-full max-w-xl gap-3 sm:grid-cols-2">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center rounded-xl border border-gray-600 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-blue-400 hover:bg-blue-500/10"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}