import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import SectionTitle from "../components/SectionTitle";
import { services } from "../data/services";

export default function Services() {
  return (
    <>
      {/* Page Header */}
      <PageHeader
        eyebrow="Road Transportation"
        title="Reliable road transportation for every journey."
        description="Reliable road transportation services for businesses and individuals, covering local, intercity, and long-distance cargo movement."
      />

      {/* Services */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Our Services"
            title="Road transportation solutions"
            description="Choose the transportation solution that best fits your cargo, route, and delivery requirements."
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.title}
                  className="flex flex-col rounded-xl border border-gray-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Icon size={23} />
                  </div>

                  {/* Title */}
                  <h2 className="mt-6 text-xl font-semibold text-gray-900">
                    {service.title}
                  </h2>

                  {/* Description */}
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="mt-6 border-t border-gray-100 pt-5">
                    <ul className="space-y-3">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-3 text-sm text-gray-700"
                        >
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />

                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto pt-7">
                    <Link
                      to="/quote"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                    >
                      Request a quote
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-gray-200 bg-gray-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="How It Works"
            title="Simple transportation process"
            description="From pickup request to delivery, we keep the process straightforward."
          />

          <div className="grid gap-6 md:grid-cols-3">
            <ProcessStep
              number="01"
              title="Share Your Requirement"
              description="Tell us your pickup location, destination, cargo details, and preferred schedule."
            />

            <ProcessStep
              number="02"
              title="Choose the Right Vehicle"
              description="We identify a suitable vehicle based on your cargo type, weight, and transportation requirements."
            />

            <ProcessStep
              number="03"
              title="Move Your Cargo"
              description="Your cargo is transported by road according to the agreed route and delivery schedule."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Need a road transportation solution?
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
              Share your transportation requirements and get a quote from our
              team.
            </p>
          </div>

          <Link
            to="/quote"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Get a Quote
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </>
  );
}

interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
}

function ProcessStep({
  number,
  title,
  description,
}: ProcessStepProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-7">
      <span className="text-sm font-bold tracking-wider text-blue-600">
        {number}
      </span>

      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-gray-600">
        {description}
      </p>
    </div>
  );
}