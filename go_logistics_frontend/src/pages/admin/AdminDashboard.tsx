import {
  BarChart3,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Truck,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  {
    name: "Overview",
    to: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Customers",
    to: "/admin/customers",
    icon: Users,
  },
  {
    name: "Quote Requests",
    to: "/admin/quotes",
    icon: ClipboardList,
  },
  {
    name: "Bookings",
    to: "/admin/bookings",
    icon: BarChart3,
  },
  {
    name: "Shipments",
    to: "/admin/shipments",
    icon: Package,
  },
  {
    name: "Vehicles",
    to: "/admin/vehicles",
    icon: Truck,
  },
  {
    name: "Payments",
    to: "/admin/payments",
    icon: CreditCard,
  },
];
const stats = [
  {
    label: "Total Customers",
    value: "1,248",
  },
  {
    label: "Pending Quotes",
    value: "32",
  },
  {
    label: "Active Shipments",
    value: "86",
  },
  {
    label: "Completed Shipments",
    value: "742",
  },
];

const recentQuotes = [
  {
    id: "QT10021",
    customer: "Rahul Sharma",
    route: "Pune → Mumbai",
    amount: "₹18,500",
    status: "Pending",
  },
  {
    id: "QT10020",
    customer: "Amit Kumar",
    route: "Mumbai → Nashik",
    amount: "₹22,000",
    status: "Approved",
  },
  {
    id: "QT10019",
    customer: "Neha Singh",
    route: "Pune → Nagpur",
    amount: "₹32,000",
    status: "Pending",
  },
  {
    id: "QT10018",
    customer: "Vikas Patel",
    route: "Pune → Aurangabad",
    amount: "₹15,800",
    status: "Approved",
  },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 bg-white transition-transform",
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-full flex-col">

          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
            <Link
              to="/admin"
              className="text-lg font-bold text-gray-900"
            >
              TransportCo
            </Link>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
  {navigation.map((item) => {
    const Icon = item.icon;

    return (
      <Link
        key={item.name}
        to={item.to}
        onClick={() => setSidebarOpen(false)}
        className={[
          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
          location.pathname === item.to
            ? "bg-blue-50 text-blue-700"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
        ].join(" ")}
      >
        <Icon size={18} />
        {item.name}
      </Link>
    );
  })}
</nav>

          {/* Bottom */}
          <div className="border-t border-gray-100 p-4">
            <Link
              to="/login"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut size={18} />
              Sign Out
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">

        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>

            <div className="ml-auto flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  Admin
                </p>

                <p className="text-xs text-gray-400">
                  Administrator
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

          <div>
            <p className="text-sm font-medium text-blue-600">
              Administration
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Dashboard Overview
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Monitor your transportation business operations.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <p className="text-sm text-gray-500">
                  {stat.label}
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Main sections */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">

            {/* Recent quotes */}
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Recent Quote Requests
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Latest customer requests
                  </p>
                </div>

                <button
                  type="button"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-left">
                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Quote
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Customer
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Route
                      </th>

                      <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentQuotes.map((quote) => (
                      <tr
                        key={quote.id}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-gray-900">
                            {quote.id}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {quote.amount}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-700">
                          {quote.customer}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {quote.route}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge
                            status={quote.status}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Quick actions */}
            <section className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-semibold text-gray-900">
                Quick Actions
              </h2>

              <div className="mt-5 space-y-3">
                <Action
                  title="Review Quote Requests"
                  description="Review and price pending quotes"
                />

                <Action
                  title="Manage Shipments"
                  description="Monitor active transportation"
                />

                <Action
                  title="Manage Vehicles"
                  description="Update vehicle availability"
                />

                <Action
                  title="View Payments"
                  description="Review recent transactions"
                />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
      {status}
    </span>
  );
}

function Action({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      className="w-full rounded-lg border border-gray-200 p-4 text-left transition hover:border-gray-300 hover:bg-gray-50"
    >
      <p className="text-sm font-semibold text-gray-900">
        {title}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>
    </button>
  );
}