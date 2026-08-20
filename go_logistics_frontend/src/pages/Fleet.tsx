import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

import PageHeader from "../components/PageHeader";
import SectionTitle from "../components/SectionTitle";
import { fleet } from "../data/fleet";

export default function Fleet() {
  return (
    <>
      {/* Page Header */}
      <PageHeader
        eyebrow="Our Fleet"
        title="The right vehicle for your cargo."
        description="Our road transportation fleet is designed to handle different cargo sizes, weights, routes, and delivery requirements."
      />

      {/* Fleet */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Vehicle Options"
            title="Choose the right capacity"
            description="From smaller local shipments to heavier long-distance cargo, we provide transportation options for different requirements."
          />

          <div className="grid gap-8 lg:grid-cols-3">
            {fleet.map((vehicle) => (
              <div
                key={vehicle.name}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {vehicle.name}
                    </h2>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {vehicle.capacity}
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-medium text-blue-600">
                    {vehicle.type}
                  </p>

                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {vehicle.description}
                  </p>

                  {/* Features */}
                  <ul className="mt-6 space-y-3 border-t border-gray-100 pt-5">
                    {vehicle.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-sm text-gray-700"
                      >
                        <CheckCircle2
                          size={17}
                          className="shrink-0 text-blue-600"
                        />

                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/quote"
                    className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    Request this vehicle
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Features */}
      <section className="border-y border-gray-200 bg-gray-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Fleet Standards"
            title="Built around reliable transportation"
            description="Vehicle selection is based on cargo requirements, route conditions, and delivery needs."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Feature
              title="Multiple Capacities"
              description="Vehicle options for different cargo weights and shipment sizes."
            />

            <Feature
              title="Regular Maintenance"
              description="Vehicles should be maintained regularly to support dependable transportation."
            />

            <Feature
              title="Route Suitable"
              description="Vehicle selection considers the route and transportation requirements."
            />

            <Feature
              title="Cargo Focused"
              description="The right vehicle helps protect cargo and improve transportation efficiency."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Not sure which vehicle you need?
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
              Tell us about your cargo and route. Our team can help determine
              a suitable transportation option.
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

interface FeatureProps {
  title: string;
  description: string;
}

function Feature({ title, description }: FeatureProps) {
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