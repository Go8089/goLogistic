import { ArrowRight, CheckCircle2, ShieldCheck, Target, Truck } from "lucide-react";
import { Link } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import SectionTitle from "../components/SectionTitle";

const values = [
  {
    icon: ShieldCheck,
    title: "Safety First",
    description:
      "We prioritize the safe handling and transportation of every shipment from pickup to delivery.",
  },
  {
    icon: Truck,
    title: "Reliable Transportation",
    description:
      "Our focus is dependable road transportation with vehicles and routes suited to each shipment.",
  },
  {
    icon: Target,
    title: "On-Time Delivery",
    description:
      "We plan transportation carefully to support predictable delivery schedules.",
  },
];

const commitments = [
  "Safe handling of customer cargo",
  "Reliable road transportation",
  "Experienced and responsible drivers",
  "Regular vehicle maintenance",
  "Clear communication throughout transportation",
  "Flexible transportation solutions",
];

export default function About() {
  return (
    <>
      {/* Header */}
      <PageHeader
        eyebrow="About Us"
        title="Moving cargo safely, reliably, and on time."
        description="We provide road transportation solutions for businesses that need dependable cargo movement across local, intercity, and long-distance routes."
      />

      {/* Introduction */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Who We Are
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              A road transportation partner you can rely on.
            </h2>

            <div className="mt-6 space-y-4 text-base leading-7 text-gray-600">
              <p>
                We specialize in road transportation and cargo movement,
                helping businesses transport goods safely and efficiently.
              </p>

              <p>
                From local deliveries to long-distance routes, our
                transportation solutions are built around the requirements of
                each shipment.
              </p>

              <p>
                Our approach is simple: understand the requirement, choose the
                right vehicle, plan the route, and deliver the cargo safely.
              </p>
            </div>

            <Link
              to="/quote"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Get a Quote
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
              alt="Road cargo transportation truck"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-gray-200 bg-gray-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="What Matters To Us"
            title="Built around reliability"
            description="Every part of our transportation service is focused on delivering a dependable experience."
          />

          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="rounded-xl border border-gray-200 bg-white p-7"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-gray-900">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commitment */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Our Commitment
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Transportation you can trust.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600">
              We focus on the fundamentals that matter most in road
              transportation: safety, reliability, communication, and
              consistent service.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {commitments.map((commitment) => (
              <div
                key={commitment}
                className="flex items-start gap-3 rounded-xl border border-gray-200 p-5"
              >
                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <p className="text-sm leading-6 text-gray-700">
                  {commitment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company highlights */}
      <section className="border-y border-gray-200 bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Why Choose Us"
            title="Focused on what matters"
            description="Our service is built around dependable road transportation and clear communication."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Highlight
              title="Road Focused"
              description="Our transportation operations are focused entirely on road-based cargo movement."
            />

            <Highlight
              title="Flexible"
              description="Transportation options can be selected according to cargo and route requirements."
            />

            <Highlight
              title="Reliable"
              description="We focus on safe handling, planned routes, and dependable delivery."
            />

            <Highlight
              title="Customer Focused"
              description="Clear communication helps keep customers informed throughout the process."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Let's move your cargo.
            </h2>

            <p className="mt-2 text-sm text-gray-400 sm:text-base">
              Get in touch with us for your next road transportation
              requirement.
            </p>
          </div>

          <Link
            to="/quote"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Get a Quote
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

interface HighlightProps {
  title: string;
  description: string;
}

function Highlight({ title, description }: HighlightProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="h-2 w-2 rounded-full bg-blue-600" />

      <h3 className="mt-4 text-base font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        {description}
      </p>
    </div>
  );
}