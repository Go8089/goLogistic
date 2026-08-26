import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";

const companyLinks = [
  { name: "About Us", to: "/about" },
  { name: "Services", to: "/services" },
  { name: "Fleet", to: "/fleet" },
  { name: "Contact", to: "/contact" },
];

const serviceLinks = [
  { name: "Road Transportation", to: "/services" },
  { name: "Local Transportation", to: "/services" },
  { name: "Intercity Transportation", to: "/services" },
  { name: "Cargo Transportation", to: "/services" },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="flex items-center gap-2.5"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Truck size={19} />
              </div>

              <span className="text-lg font-bold tracking-tight text-gray-900">
                DTR
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-gray-600">
              Reliable road transportation solutions for businesses and
              customers across local, intercity, and long-distance routes.
            </p>

            <Link
              to="/quote"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Request a Quote
              <ArrowRight size={15} />
            </Link>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Company
            </h3>

            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-600 transition hover:text-blue-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Services
            </h3>

            <ul className="mt-5 space-y-3">
              {serviceLinks.map((link, index) => (
                <li key={`${link.name}-${index}`}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-600 transition hover:text-blue-600"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Contact
            </h3>

            <div className="mt-5 space-y-4">
              <div className="flex gap-3">
                <Phone
                  size={17}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <div>
                  <p className="text-sm font-medium text-gray-900">
                    +91 931-008-0296
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Mon–Sun, 5:00 AM – 11:00 PM
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail
                  size={17}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <p className="text-sm text-gray-600">
                  contact@dtr.com
                </p>
              </div>

              <div className="flex gap-3">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <p className="text-sm text-gray-600">
                  Delhi, Tata, Bihar, India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} DTR. All rights reserved.
          </p>

          <div className="flex gap-5">
            <Link
              to="/"
              className="text-xs text-gray-500 hover:text-gray-900"
            >
              Privacy
            </Link>

            <Link
              to="/"
              className="text-xs text-gray-500 hover:text-gray-900"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}