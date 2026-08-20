import { useState } from "react";
import {
  Menu,
  X,
  Truck,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";

const navigation = [
  { name: "Home", to: "/" },
  { name: "Services", to: "/services" },
  { name: "Fleet", to: "/fleet" },
  { name: "About", to: "/about" },
  { name: "Tracking", to: "/tracking" },
  { name: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Truck size={19} />
          </div>

          <span className="text-lg font-bold tracking-tight text-gray-900">
            goLogistic
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <NavItem
              key={item.to}
              name={item.name}
              to={item.to}
            />
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Link
            to="/quote"
            className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={
            mobileOpen ? "Close navigation" : "Open navigation"
          }
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((current) => !current)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 lg:hidden"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    [
                      "block rounded-lg px-4 py-3 text-sm font-medium transition",
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50",
                    ].join(" ")
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            <Link
              to="/quote"
              onClick={closeMobileMenu}
              className="mt-4 flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Get a Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

interface NavItemProps {
  name: string;
  to: string;
}

function NavItem({ name, to }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        [
          "relative text-sm font-medium transition",
          isActive
            ? "text-blue-600"
            : "text-gray-600 hover:text-gray-900",
        ].join(" ")
      }
    >
      {name}
    </NavLink>
  );
}