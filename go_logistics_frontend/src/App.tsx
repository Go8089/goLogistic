import {
 Routes,
 Route,
 Outlet,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Fleet from "./pages/Fleet";
import About from "./pages/About";
import Quote from "./pages/Quote";
import Tracking from "./pages/Tracking";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import VerifyPhone from "./pages/auth/VerifyPhone";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyResetOtp from "./pages/auth/VerifyResetOtp";
import ResetPassword from "./pages/auth/ResetPassword";

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
  <Route element={<PublicLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/services" element={<Services />} />
    <Route path="/fleet" element={<Fleet />} />
    <Route path="/about" element={<About />} />
    <Route path="/tracking" element={<Tracking />} />
    <Route path="/quote" element={<Quote />} />
    <Route path="/contact" element={<Contact />} />
  </Route>

  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/verify-email" element={<VerifyEmail />} />
  <Route path="/verify-phone" element={<VerifyPhone />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
  <Route path="/reset-password" element={<ResetPassword />} />
  <Route path="/admin/login" element={<AdminLogin />} />

  <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/admin/quotes" element={<AdminQuotes />} />
    <Route path="/admin/quotes/:id" element={<AdminQuoteDetails />} />
    <Route path="/admin/customers" element={<AdminCustomers />} />
    <Route path="/admin/bookings" element={<AdminBookings />} />
    <Route path="/admin/shipments" element={<AdminShipments />} />
    <Route path="/admin/vehicles" element={<AdminVehicles />} />
    <Route path="/admin/payments" element={<AdminPayments />} />
  </Route>

  <Route element={<ProtectedRoute allowedRole="CUSTOMER" />}>
    <Route path="/dashboard" element={<DashboardLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="shipments" element={<Shipments />} />
      <Route path="shipments/:id" element={<ShipmentDetails />} />
      <Route path="tracking" element={<DTracking />} />
      <Route path="quotes" element={<Quotes />} />
      <Route path="quotes/:id" element={<QuoteDetails />} />
      <Route path="quotes/:id/book" element={<BookingConfirmation />} />
      <Route path="profile" element={<Profile />} />
      <Route path="payment" element={<Payment />} />
      <Route path="payment-success" element={<PaymentSuccess />} />
    </Route>
  </Route>

  <Route path="*" element={<NotFound />} />
</Routes>
 );
}