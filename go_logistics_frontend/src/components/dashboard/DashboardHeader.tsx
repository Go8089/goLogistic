import { Bell, Menu, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({
  onMenuClick,
}: DashboardHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      {/* Mobile menu */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open dashboard menu"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
      >
        <Menu size={21} />
      </button>

      <div className="hidden lg:block">
        <p className="text-sm font-medium text-gray-500">
          Customer Dashboard
        </p>
      </div>

      {/* Right */}
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
        >
          <Bell size={19} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-600" />
        </button>

        <Link
          to="/dashboard/profile"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-gray-50"
        >
          <UserCircle size={29} className="text-gray-500" />

          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-gray-900">
              Customer
            </p>

            <p className="text-xs text-gray-500">
              Account
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}