import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";

const navigation = [
  {
    name: "Overview",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Shipments",
    path: "/dashboard/shipments",
    icon: Package,
  },
  {
    name: "Track Shipment",
    path: "/dashboard/tracking",
    icon: Truck,
  },
  {
    name: "My Quotes",
    path: "/dashboard/quotes",
    icon: Search,
  },
  {
    name: "Profile",
    path: "/dashboard/profile",
    icon: UserRound,
  },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200",
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Truck size={18} />
            </div>

            <span className="text-lg font-bold text-gray-900">
              TransMove
            </span>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-5">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                onClick={() => setSidebarOpen(false)}
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
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-200 p-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut size={18} />
            Back to Website
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            {/* Left */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
              >
                <Menu size={21} />
              </button>

              <div className="hidden text-sm font-medium text-gray-500 sm:block">
                Customer Dashboard
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              {/* Notification */}
              <button
                aria-label="Notifications"
                className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <Bell size={19} />

                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-600" />
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() =>
                    setProfileOpen((previous) => !previous)
                  }
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700">
                    G
                  </div>

                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-semibold text-gray-900">
                      Gopal Kumar
                    </p>

                    <p className="text-xs text-gray-400">
                      Customer
                    </p>
                  </div>

                  <ChevronDown
                    size={16}
                    className="hidden text-gray-400 sm:block"
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-48 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg">
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Profile
                    </Link>

                    <button
                      onClick={() => setProfileOpen(false)}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="min-h-[calc(100vh-8rem)]">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white">
          <div className="flex flex-col gap-2 px-4 py-5 text-center text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left">
            <p>
              © 2026 TransMove. All rights reserved.
            </p>

            <p>
              Road transportation services
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}