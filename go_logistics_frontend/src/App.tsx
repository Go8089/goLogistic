import {
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

// Layouts / Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
// Public Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Fleet from "./pages/Fleet";
import About from "./pages/About";
import Quote from "./pages/Quote";
import Tracking from "./pages/Tracking";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Customer Dashboard
import Dashboard from "./pages/dashboard/Dashboard";
import Shipments from "./pages/dashboard/Shipments";
import ShipmentDetails from "./pages/dashboard/ShipmentDetails";
import DTracking from "./pages/dashboard/Tracking";
import Quotes from "./pages/dashboard/Quotes";
import QuoteDetails from "./pages/dashboard/QuoteDetails";
import BookingConfirmation from "./pages/dashboard/BookingConfirmation";
import Profile from "./pages/dashboard/Profile";
import Payment from "./pages/dashboard/Payment";
import PaymentSuccess from "./pages/dashboard/PaymentSuccess";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminQuotes from "./pages/admin/AdminQuotes";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminShipments from "./pages/admin/AdminShipments";
import AdminVehicles from "./pages/admin/AdminVehicles";
import AdminQuoteDetails from "./pages/admin/AdminQuoteDetails";
import AdminPayments from "./pages/admin/AdminPayments";

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* =========================
          PUBLIC WEBSITE
      ========================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/fleet" element={<Fleet />} />
        <Route path="/about" element={<About />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/quote" element={<Quote />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* =========================
          AUTH
      ========================= */}
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* =========================
          ADMIN
      ========================= */}
      <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />

      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      <Route
        path="/admin/quotes"
        element={<AdminQuotes />}
      />
      <Route
        path="/admin/quotes/:id"
        element={<AdminQuoteDetails />}
      />
      <Route
        path="/admin/customers"
        element={<AdminCustomers />}
      />

      <Route
        path="/admin/bookings"
        element={<AdminBookings />}
      />

      <Route
        path="/admin/shipments"
        element={<AdminShipments />}
      />

      <Route
        path="/admin/vehicles"
        element={<AdminVehicles />}
      />
       <Route
        path="/admin/payments"
        element={<AdminPayments />}
        />
        </Route>
      {/* =========================
          CUSTOMER DASHBOARD
      ========================= */}
      <Route
  element={<ProtectedRoute allowedRole="CUSTOMER" />}
>
      <Route
        path="/dashboard"
        element={<DashboardLayout />}
      >
        {/* Dashboard */}
        <Route
          index
          element={<Dashboard />}
        />

        {/* Shipments */}
        <Route
          path="shipments"
          element={<Shipments />}
        />

        <Route
          path="shipments/:id"
          element={<ShipmentDetails />}
        />

        {/* Tracking */}
        <Route
          path="tracking"
          element={<DTracking />}
        />

        {/* Quotes */}
        <Route
          path="quotes"
          element={<Quotes />}
        />

        <Route
          path="quotes/:id"
          element={<QuoteDetails />}
        />

        <Route
          path="quotes/:id/book"
          element={<BookingConfirmation />}
        />

        {/* Profile */}
        <Route
          path="profile"
          element={<Profile />}
        />

        {/* Payment */}
        <Route
          path="/dashboard/payment"
          element={<Payment />}
        />

        <Route
          path="/dashboard/payment-success"
          element={<PaymentSuccess />}
        />
      </Route>
</Route>
      {/* =========================
          404
      ========================= */}
      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}