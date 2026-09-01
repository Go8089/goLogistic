package com.goLogistic.admin;

import com.goLogistic.booking.Booking;
import com.goLogistic.booking.BookingRepository;
import com.goLogistic.booking.BookingStatus;
import com.goLogistic.payment.Payment;
import com.goLogistic.payment.PaymentRepository;
import com.goLogistic.payment.PaymentStatus;
import com.goLogistic.quote.QuoteRequest;
import com.goLogistic.quote.QuoteRequestRepository;
import com.goLogistic.quote.QuoteStatus;
import com.goLogistic.shipment.Shipment;
import com.goLogistic.shipment.ShipmentRepository;
import com.goLogistic.shipment.ShipmentStatus;
import com.goLogistic.user.Role;
import com.goLogistic.user.User;
import com.goLogistic.user.UserRepository;
import com.goLogistic.vehicle.Vehicle;
import com.goLogistic.vehicle.VehicleRepository;
import com.goLogistic.vehicle.VehicleStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final QuoteRequestRepository quoteRequestRepository;
    private final BookingRepository bookingRepository;
    private final ShipmentRepository shipmentRepository;
    private final PaymentRepository paymentRepository;
    private final VehicleRepository vehicleRepository;

    private final com.goLogistic.payment.PaymentService paymentService;

    public AdminController(
        UserRepository userRepository,
        QuoteRequestRepository quoteRequestRepository,
        BookingRepository bookingRepository,
        ShipmentRepository shipmentRepository,
        PaymentRepository paymentRepository,
        VehicleRepository vehicleRepository,
        com.goLogistic.payment.PaymentService paymentService
    ) {
        this.userRepository = userRepository;
        this.quoteRequestRepository = quoteRequestRepository;
        this.bookingRepository = bookingRepository;
        this.shipmentRepository = shipmentRepository;
        this.paymentRepository = paymentRepository;
        this.vehicleRepository = vehicleRepository;
        this.paymentService = paymentService;
    }

    @GetMapping("/me")
    public Map<String, Object> me(Authentication authentication) {
        return Map.of(
            "message", "Admin access granted",
            "email", authentication.getName()
        );
    }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        List<QuoteRequest> quotes = quoteRequestRepository.findAll();
        List<User> customers = userRepository.findAll().stream()
            .filter(user -> user.getRole() == Role.CUSTOMER)
            .toList();
        List<Shipment> shipments = shipmentRepository.findAll();

        List<Map<String, Object>> stats = List.of(
            Map.of("label", "Total Customers", "value", customers.size()),
            Map.of("label", "Pending Quotes", "value", countQuoteStatus(quotes, QuoteStatus.PENDING)),
            Map.of("label", "Active Shipments", "value", countShipmentStatus(shipments, ShipmentStatus.IN_TRANSIT)),
            Map.of("label", "Completed Shipments", "value", countShipmentStatus(shipments, ShipmentStatus.DELIVERED))
        );

        List<Map<String, Object>> recentQuotes = quotes.stream()
            .sorted(Comparator.comparing(QuoteRequest::getRequestedAt).reversed())
            .limit(4)
            .map(this::toQuoteMap)
            .toList();

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("stats", stats);
        payload.put("recentQuotes", recentQuotes);
        return payload;
    }

    @GetMapping("/quotes")
    public List<Map<String, Object>> getQuotes() {
        return quoteRequestRepository.findAll().stream()
            .sorted(Comparator.comparing(QuoteRequest::getRequestedAt).reversed())
            .map(this::toQuoteMap)
            .toList();
    }

    @GetMapping("/quotes/{id}")
    public ResponseEntity<Map<String, Object>> getQuoteById(@PathVariable String id) {
        QuoteRequest quote = quoteRequestRepository.findByReferenceCode(id).orElse(null);
        if (quote == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toQuoteMap(quote));
    }

    @GetMapping("/customers")
    public List<Map<String, Object>> getCustomers() {
        List<Map<String, Object>> customers = new ArrayList<>();
        List<User> users = userRepository.findAll().stream()
            .filter(user -> user.getRole() == Role.CUSTOMER)
            .sorted(Comparator.comparing(User::getCreatedAt, Comparator.nullsLast(LocalDateTime::compareTo)).reversed())
            .toList();

        for (User user : users) {
            customers.add(customer(
                user.getId().toString(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                0,
                formatDate(user.getCreatedAt()),
                user.isEnabled() ? "Active" : "Inactive",
                user.getPreferredNotificationChannel() != null ? user.getPreferredNotificationChannel().name() : "EMAIL"
            ));
        }

        return customers;
    }

    @GetMapping("/bookings")
    public List<Map<String, Object>> getBookings() {
        return bookingRepository.findAll().stream()
            .sorted(Comparator.comparing(Booking::getBookingDate).reversed())
            .map(this::toBookingMap)
            .toList();
    }

    @GetMapping("/shipments")
    public List<Map<String, Object>> getShipments() {
        return shipmentRepository.findAll().stream()
            .sorted(Comparator.comparing(Shipment::getShipmentDate).reversed())
            .map(this::toShipmentMap)
            .toList();
    }

    @GetMapping("/vehicles")
    public List<Map<String, Object>> getVehicles() {
        return vehicleRepository.findAll().stream()
            .sorted(Comparator.comparing(Vehicle::getUpdatedAt, Comparator.nullsLast(LocalDateTime::compareTo)).reversed())
            .map(this::toVehicleMap)
            .toList();
    }

    @PostMapping("/vehicles")
    public ResponseEntity<Map<String, Object>> createVehicle(@RequestBody Map<String, Object> payload) {
        String registrationNumber = String.valueOf(payload.getOrDefault("registrationNumber", "")).trim();
        if (registrationNumber.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Registration number is required"));
        }

        Vehicle existing = vehicleRepository.findByRegistrationNumber(registrationNumber).orElse(null);
        if (existing != null) {
            return ResponseEntity.status(409).body(Map.of("message", "Vehicle with this registration already exists"));
        }

        Vehicle vehicle = new Vehicle();
        vehicle.setRegistrationNumber(registrationNumber);
        vehicle.setVehicleType(String.valueOf(payload.getOrDefault("vehicleType", "Truck")).trim());
        vehicle.setContainerSize(String.valueOf(payload.getOrDefault("containerSize", "20 ft")).trim());
        vehicle.setCapacity(String.valueOf(payload.getOrDefault("capacity", "5 Ton")).trim());
        vehicle.setDriver(String.valueOf(payload.getOrDefault("driver", "Not Assigned")));
        vehicle.setStatus(parseVehicleStatus(String.valueOf(payload.getOrDefault("status", "AVAILABLE"))));

        return ResponseEntity.status(201).body(toVehicleMap(vehicleRepository.save(vehicle)));
    }

    @PutMapping("/vehicles/{id}")
    public ResponseEntity<Map<String, Object>> updateVehicle(
        @PathVariable String id,
        @RequestBody Map<String, Object> payload
    ) {
        Vehicle vehicle = vehicleRepository.findById(UUID.fromString(id)).orElse(null);
        if (vehicle == null) {
            return ResponseEntity.notFound().build();
        }

        if (payload.containsKey("registrationNumber") && payload.get("registrationNumber") != null) {
            String registration = String.valueOf(payload.get("registrationNumber")).trim();
            if (!registration.isBlank()) {
                vehicle.setRegistrationNumber(registration);
            }
        }
        if (payload.containsKey("vehicleType") && payload.get("vehicleType") != null) {
            vehicle.setVehicleType(String.valueOf(payload.get("vehicleType")).trim());
        }
        if (payload.containsKey("containerSize") && payload.get("containerSize") != null) {
            vehicle.setContainerSize(String.valueOf(payload.get("containerSize")).trim());
        }
        if (payload.containsKey("capacity") && payload.get("capacity") != null) {
            vehicle.setCapacity(String.valueOf(payload.get("capacity")).trim());
        }
        if (payload.containsKey("driver") && payload.get("driver") != null) {
            vehicle.setDriver(String.valueOf(payload.get("driver")));
        }
        if (payload.containsKey("status") && payload.get("status") != null) {
            vehicle.setStatus(parseVehicleStatus(String.valueOf(payload.get("status"))));
        }

        return ResponseEntity.ok(toVehicleMap(vehicleRepository.save(vehicle)));
    }

    @DeleteMapping("/vehicles/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable String id) {
        Vehicle vehicle = vehicleRepository.findById(UUID.fromString(id)).orElse(null);
        if (vehicle == null) {
            return ResponseEntity.notFound().build();
        }
        vehicleRepository.delete(vehicle);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/payments")
    public List<Map<String, Object>> getPayments() {
        return paymentRepository.findAll().stream()
            .sorted(Comparator.comparing(Payment::getPaymentDate).reversed())
            .map(this::toPaymentMap)
            .toList();
    }

    @PatchMapping("/quotes/{id}/status")
    public ResponseEntity<Map<String, Object>> updateQuoteStatus(
        @PathVariable String id,
        @RequestBody Map<String, Object> payload
    ) {
        QuoteRequest quote = quoteRequestRepository.findByReferenceCode(id).orElse(null);
        if (quote == null) {
            return ResponseEntity.notFound().build();
        }

        String statusValue = String.valueOf(payload.getOrDefault("status", quote.getStatus().name()));
        quote.setStatus(QuoteStatus.valueOf(statusValue.toUpperCase(Locale.ROOT)));

        if (payload.containsKey("amount") && payload.get("amount") != null) {
            quote.setAmount(new BigDecimal(String.valueOf(payload.get("amount")).replace("₹", "").replace(",", "")));
        }

        QuoteRequest saved = quoteRequestRepository.save(quote);
        return ResponseEntity.ok(toQuoteMap(saved));
    }

    @PatchMapping("/customers/{id}/status")
    public ResponseEntity<Map<String, Object>> updateCustomerStatus(
        @PathVariable String id,
        @RequestBody Map<String, Object> payload
    ) {
        User user = userRepository.findById(UUID.fromString(id)).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        String requested = String.valueOf(payload.getOrDefault("status", user.isEnabled() ? "Active" : "Inactive"));
        user.setEnabled("Active".equalsIgnoreCase(requested));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
            "id", id,
            "status", user.isEnabled() ? "Active" : "Inactive",
            "enabled", user.isEnabled()
        ));
    }

    @PatchMapping("/bookings/{id}/status")
    public ResponseEntity<Map<String, Object>> updateBookingStatus(
        @PathVariable String id,
        @RequestBody Map<String, Object> payload
    ) {
        Booking booking = bookingRepository.findByBookingCode(id).orElse(null);
        if (booking == null) {
            return ResponseEntity.notFound().build();
        }

        String statusValue = String.valueOf(payload.getOrDefault("status", booking.getStatus().name()));
        String normalized = statusValue.toUpperCase(Locale.ROOT).replace(' ', '_');
        booking.setStatus(BookingStatus.valueOf(normalized));
        Booking saved = bookingRepository.save(booking);
        return ResponseEntity.ok(toBookingMap(saved));
    }

    @PostMapping("/bookings/{bookingCode}/shipments")
    public ResponseEntity<Map<String, Object>> createShipmentForBooking(
        @PathVariable String bookingCode,
        @RequestBody Map<String, Object> payload
    ) {
        Booking booking = bookingRepository.findByBookingCode(bookingCode).orElse(null);
        if (booking == null) {
            return ResponseEntity.notFound().build();
        }

        if (shipmentRepository.findByBooking(booking).isPresent()) {
            return ResponseEntity.status(409).body(Map.of("message", "Shipment already exists for this booking"));
        }

        Shipment shipment = new Shipment();
        shipment.setBooking(booking);
        shipment.setCustomer(booking.getCustomer());
        shipment.setOrigin(booking.getRoute().contains("→") ? booking.getRoute().split("→", 2)[0].trim() : booking.getRoute());
        shipment.setDestination(booking.getRoute().contains("→") ? booking.getRoute().split("→", 2)[1].trim() : booking.getRoute());
        String registration = String.valueOf(payload.getOrDefault("vehicleRegistration", booking.getVehicle() != null ? booking.getVehicle() : "MH12 AB 1234"));
        shipment.setVehicleRegistration(registration);
        shipment.setShipmentDate(LocalDateTime.now());
        shipment.setEstimatedDelivery(LocalDateTime.now().plusDays(2));
        shipment.setStatus(ShipmentStatus.ASSIGNED);
        shipment.addTrackingEvent(ShipmentStatus.ASSIGNED, "Vehicle assigned and shipment is ready for pickup");
        booking.setStatus(BookingStatus.ASSIGNED);
        bookingRepository.save(booking);

        Shipment saved = shipmentRepository.save(shipment);
        syncVehicleStatus(saved.getVehicleRegistration(), saved.getStatus());
        return ResponseEntity.status(201).body(toShipmentMap(saved));
    }

    @PatchMapping("/shipments/{id}/status")
    public ResponseEntity<Map<String, Object>> updateShipmentStatus(
        @PathVariable String id,
        @RequestBody Map<String, Object> payload
    ) {
        Shipment shipment = shipmentRepository.findByTrackingCode(id).orElse(null);
        if (shipment == null) {
            return ResponseEntity.notFound().build();
        }

        String statusValue = String.valueOf(payload.getOrDefault("status", shipment.getStatus().name()));
        String normalized = statusValue.toUpperCase(Locale.ROOT).replace(' ', '_');
        ShipmentStatus previousStatus = shipment.getStatus();
        ShipmentStatus nextStatus = ShipmentStatus.valueOf(normalized);
        shipment.setStatus(nextStatus);

        if (payload.containsKey("vehicleRegistration") && payload.get("vehicleRegistration") != null) {
            shipment.setVehicleRegistration(String.valueOf(payload.get("vehicleRegistration")));
        }

        if (previousStatus != nextStatus) {
            shipment.addTrackingEvent(nextStatus, "Shipment status updated to " + formatShipmentStatus(nextStatus));
        }

        if (shipment.getStatus() == ShipmentStatus.ASSIGNED && shipment.getBooking() != null) {
            shipment.getBooking().setStatus(BookingStatus.ASSIGNED);
            bookingRepository.save(shipment.getBooking());
        }
        if (shipment.getStatus() == ShipmentStatus.IN_TRANSIT && shipment.getBooking() != null) {
            shipment.getBooking().setStatus(BookingStatus.IN_TRANSIT);
            bookingRepository.save(shipment.getBooking());
        }
        if (shipment.getStatus() == ShipmentStatus.DELIVERED && shipment.getBooking() != null) {
            shipment.getBooking().setStatus(BookingStatus.DELIVERED);
            bookingRepository.save(shipment.getBooking());
        }
        if (shipment.getStatus() == ShipmentStatus.COMPLETED && shipment.getBooking() != null) {
            shipment.getBooking().setStatus(BookingStatus.COMPLETED);
            bookingRepository.save(shipment.getBooking());
        }

        Shipment saved = shipmentRepository.save(shipment);
        syncVehicleStatus(saved.getVehicleRegistration(), saved.getStatus());
        return ResponseEntity.ok(toShipmentMap(saved));
    }

    @PatchMapping("/payments/{id}/status")
    public ResponseEntity<Map<String, Object>> updatePaymentStatus(
        @PathVariable String id,
        @RequestBody Map<String, Object> payload
    ) {
        String statusValue = String.valueOf(payload.getOrDefault("status", ""));
        try {
            com.goLogistic.payment.Payment updated = paymentService.updatePaymentStatus(id, statusValue);
            return ResponseEntity.ok(toPaymentMap(updated));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(409).body(Map.of("message", ex.getMessage()));
        }
    }

    @PutMapping("/users/{id}/notification-channel")
    public ResponseEntity<Map<String, Object>> updateUserNotificationChannel(
        @PathVariable String id,
        @RequestBody Map<String, String> payload
    ) {
        java.util.UUID userId;
        try {
            userId = java.util.UUID.fromString(id);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid user id"));
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        String channel = payload.getOrDefault("notificationChannel", "").trim();
        if (channel.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "notificationChannel is required"));
        }

        try {
            com.goLogistic.notification.NotificationChannel nc = com.goLogistic.notification.NotificationChannel.valueOf(channel.toUpperCase());
            user.setPreferredNotificationChannel(nc);
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("message", "updated", "notificationChannel", nc.name()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", "Unknown notification channel"));
        }
    }

    private Map<String, Object> toQuoteMap(QuoteRequest quote) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", quote.getReferenceCode());
        item.put("customer", quote.getCustomerName());
        item.put("email", quote.getEmail());
        item.put("origin", quote.getOrigin());
        item.put("destination", quote.getDestination());
        item.put("cargo", quote.getCargo());
        item.put("weight", quote.getWeight());
        item.put("containerSize", quote.getContainerSize());
        item.put("requestedDate", formatDate(quote.getRequestedAt()));
        item.put("requestedVehicle", quote.getRequestedVehicle());
        item.put("amount", formatCurrency(quote.getAmount()));
        item.put("status", formatQuoteStatus(quote.getStatus()));
        return item;
    }

    private Map<String, Object> toBookingMap(Booking booking) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", booking.getBookingCode());
        item.put("customer", booking.getCustomer().getName());
        item.put("route", booking.getRoute());
        item.put("vehicle", booking.getVehicle());
        item.put("bookingDate", formatDate(booking.getBookingDate()));
        item.put("amount", formatCurrency(booking.getAmount()));
        item.put("status", formatBookingStatus(booking.getStatus()));
        return item;
    }

    private Map<String, Object> toShipmentMap(Shipment shipment) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", shipment.getTrackingCode());
        item.put("bookingId", shipment.getBooking().getBookingCode());
        item.put("customer", shipment.getCustomer().getName());
        item.put("origin", shipment.getOrigin());
        item.put("destination", shipment.getDestination());
        item.put("vehicle", shipment.getVehicleRegistration());
        item.put("shipmentDate", formatDate(shipment.getShipmentDate()));
        item.put("estimatedDelivery", formatDate(shipment.getEstimatedDelivery()));
        item.put("status", formatShipmentStatus(shipment.getStatus()));
        return item;
    }

    private Map<String, Object> toPaymentMap(Payment payment) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", payment.getPaymentCode());
        item.put("quoteId", payment.getQuoteReference());
        item.put("customer", payment.getCustomer().getName());
        item.put("email", payment.getCustomer().getEmail());
        item.put("amount", payment.getAmount().doubleValue());
        item.put("method", payment.getMethod());
        item.put("transactionReference", payment.getTransactionReference());
        item.put("date", formatDate(payment.getPaymentDate()));
        item.put("status", formatPaymentStatus(payment.getStatus()));
        return item;
    }

    private Map<String, Object> customer(
        String id,
        String name,
        String email,
        String phone,
        int shipments,
        String joinedDate,
        String status,
        String notificationChannel
    ) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", id);
        item.put("name", name);
        item.put("email", email);
        item.put("phone", phone);
        item.put("shipments", shipments);
        item.put("joinedDate", joinedDate);
        item.put("status", status);
        item.put("notificationChannel", notificationChannel);
        return item;
    }

    private Map<String, Object> toVehicleMap(Vehicle vehicle) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("id", vehicle.getId().toString());
        item.put("registrationNumber", vehicle.getRegistrationNumber());
        item.put("vehicleType", vehicle.getVehicleType());
        item.put("containerSize", vehicle.getContainerSize());
        item.put("capacity", vehicle.getCapacity());
        item.put("driver", vehicle.getDriver());
        item.put("status", formatVehicleStatus(vehicle.getStatus()));
        return item;
    }

    private VehicleStatus parseVehicleStatus(String statusValue) {
        if (statusValue == null || statusValue.isBlank()) {
            return VehicleStatus.AVAILABLE;
        }

        try {
            return VehicleStatus.valueOf(statusValue.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            return VehicleStatus.AVAILABLE;
        }
    }

    private String formatVehicleStatus(VehicleStatus status) {
        if (status == null) {
            return "Available";
        }
        return switch (status) {
            case AVAILABLE -> "Available";
            case ASSIGNED -> "Assigned";
            case MAINTENANCE -> "Maintenance";
        };
    }

    private void syncVehicleStatus(String registrationNumber, ShipmentStatus shipmentStatus) {
        if (registrationNumber == null || registrationNumber.isBlank()) {
            return;
        }

        vehicleRepository.findByRegistrationNumber(registrationNumber).ifPresent(vehicle -> {
            if (shipmentStatus == ShipmentStatus.ASSIGNED || shipmentStatus == ShipmentStatus.IN_TRANSIT) {
                vehicle.setStatus(VehicleStatus.ASSIGNED);
            } else if (shipmentStatus == ShipmentStatus.DELIVERED || shipmentStatus == ShipmentStatus.COMPLETED) {
                vehicle.setStatus(VehicleStatus.AVAILABLE);
                vehicle.setDriver("Not Assigned");
            } else {
                vehicle.setStatus(VehicleStatus.AVAILABLE);
            }
            vehicleRepository.save(vehicle);
        });
    }

    private int countQuoteStatus(List<QuoteRequest> items, QuoteStatus status) {
        return (int) items.stream().filter(item -> item.getStatus() == status).count();
    }

    private int countShipmentStatus(List<Shipment> items, ShipmentStatus status) {
        return (int) items.stream().filter(item -> item.getStatus() == status).count();
    }

    private String formatQuoteStatus(QuoteStatus status) {
        if (status == null) return "Pending";
        return switch (status) {
            case PENDING -> "Pending";
            case APPROVED -> "Approved";
            case REJECTED -> "Rejected";
            case EXPIRED -> "Expired";
        };
    }

    private String formatBookingStatus(BookingStatus status) {
        if (status == null) return "Created";
        return switch (status) {
            case CREATED -> "Created";
            case PAYMENT_PENDING -> "Payment Pending";
            case CONFIRMED -> "Confirmed";
            case ASSIGNED -> "Assigned";
            case IN_TRANSIT -> "In Transit";
            case DELIVERED -> "Delivered";
            case COMPLETED -> "Completed";
            case CANCELLED -> "Cancelled";
        };
    }

    private String formatShipmentStatus(ShipmentStatus status) {
        if (status == null) return "Pending";
        return switch (status) {
            case PENDING -> "Pending";
            case ASSIGNED -> "Assigned";
            case IN_TRANSIT -> "In Transit";
            case DELIVERED -> "Delivered";
            case COMPLETED -> "Completed";
        };
    }

    private String formatPaymentStatus(PaymentStatus status) {
        if (status == null) return "Pending";
        return switch (status) {
            case SUCCESS -> "Success";
            case PENDING -> "Pending";
            case FAILED -> "Failed";
            case REFUNDED -> "Refunded";
        };
    }

    private String formatCurrency(BigDecimal amount) {
        if (amount == null) {
            return "₹0";
        }
        NumberFormat format = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
        return format.format(amount);
    }

    private String formatDate(LocalDateTime dateTime) {
        return dateTime == null ? "N/A" : dateTime.format(DateTimeFormatter.ofPattern("MMM d, yyyy"));
    }
}
