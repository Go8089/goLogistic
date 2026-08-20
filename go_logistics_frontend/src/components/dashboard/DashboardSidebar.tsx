import {
  LayoutDashboard,
  Package,
  MapPin,
  FileText,
  User,
  Truck,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface DashboardSidebarProps {
  open: boolean;
  onClose: () => void;
}

const navigation = [
  {
    name: "Overview",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Shipments",
    to: "/dashboard/shipments",
    icon: Package,
  },
  {
    name: "Track Shipment",
    to: "/dashboard/tracking",
    icon: MapPin,
  },
  {
    name: "My Quotes",
    to: "/dashboard/quotes",
    icon: FileText,
  },
  {
    name: "Profile",
    to: "/dashboard/profile",
    icon: User,
  },
];

export default function DashboardSidebar({
  open,
  onClose,
}: DashboardSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close dashboard menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Truck size={19} />
            </div>

            <span className="text-lg font-bold tracking-tight text-gray-900">
              TransMove
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5">
          <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Dashboard
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/dashboard"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    ].join(" ")
                  }
                >
                  <Icon size={18} />
                  {item.name}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-200 p-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-xs font-semibold text-gray-900">
              Need transportation?
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              Request a quote for your next shipment.
            </p>

            <NavLink
              to="/dashboard/quotes/new"
              onClick={onClose}
              className="mt-3 inline-block text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Request Quote →
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
}