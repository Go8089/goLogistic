package com.goLogistic.customer;

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

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

   private final UserRepository userRepository;
   private final QuoteRequestRepository quoteRequestRepository;
   private final BookingRepository bookingRepository;
   private final PaymentRepository paymentRepository;
   private final ShipmentRepository shipmentRepository;
   private final org.springframework.context.ApplicationEventPublisher eventPublisher;

   public CustomerController(
       UserRepository userRepository,
       QuoteRequestRepository quoteRequestRepository,
       BookingRepository bookingRepository,
       PaymentRepository paymentRepository,
       ShipmentRepository shipmentRepository,
       org.springframework.context.ApplicationEventPublisher eventPublisher
   ) {
       this.userRepository = userRepository;
       this.quoteRequestRepository = quoteRequestRepository;
       this.bookingRepository = bookingRepository;
       this.paymentRepository = paymentRepository;
       this.shipmentRepository = shipmentRepository;
       this.eventPublisher = eventPublisher;
   }

   @GetMapping("/me")
   public ResponseEntity<Map<String, Object>> me(
       Authentication authentication
   ) {
       User user = currentUser(authentication);
       return ResponseEntity.ok(toProfileMap(user));
   }

   @PostMapping("/quotes")
   public ResponseEntity<Map<String, Object>> createQuote(
       Authentication authentication,
       @Valid @RequestBody CreateQuoteRequest request
   ) {
       User user = currentUser(authentication);

       QuoteRequest quote = new QuoteRequest();
       quote.setCustomer(user);
       quote.setCustomerName(user.getName());
       quote.setEmail(user.getEmail());
       quote.setOrigin(request.origin().trim());
       quote.setDestination(request.destination().trim());
       quote.setCargo(request.cargo().trim());
       quote.setWeight(request.weight().trim());
       quote.setContainerSize(request.containerSize().trim());
       quote.setRequestedVehicle(request.requestedVehicle().trim());
       quote.setAmount(new BigDecimal(request.amount().trim().replaceAll("[₹,]", "")));
       quote.setStatus(QuoteStatus.PENDING);
       QuoteRequest saved = quoteRequestRepository.save(quote);

       return ResponseEntity.status(HttpStatus.CREATED).body(toQuoteMap(saved));
   }

   @GetMapping("/quotes")
   public ResponseEntity<List<Map<String, Object>>> getMyQuotes(
       Authentication authentication
   ) {
       User user = currentUser(authentication);
       List<QuoteRequest> quotes = quoteRequestRepository.findByCustomerOrderByRequestedAtDesc(user);
       return ResponseEntity.ok(quotes.stream().map(this::toQuoteMap).toList());
   }

   @GetMapping("/quotes/{referenceCode}")
   public ResponseEntity<Map<String, Object>> getQuoteById(
       Authentication authentication,
       @PathVariable String referenceCode
   ) {
       User user = currentUser(authentication);
       QuoteRequest quote = quoteRequestRepository.findByReferenceCode(referenceCode)
           .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quote not found"));

       if (!quote.getCustomer().getId().equals(user.getId())) {
           throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Quote does not belong to this customer");
       }

       return ResponseEntity.ok(toQuoteMap(quote));
   }

   @PostMapping("/quotes/{referenceCode}/accept")
   public ResponseEntity<Map<String, Object>> acceptQuote(
       Authentication authentication,
       @PathVariable String referenceCode
   ) {
       User user = currentUser(authentication);
       QuoteRequest quote = quoteRequestRepository.findByReferenceCode(referenceCode)
           .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quote not found"));

       if (!quote.getCustomer().getId().equals(user.getId())) {
           throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Quote does not belong to this customer");
       }

       if (quote.getStatus() != QuoteStatus.APPROVED) {
           throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only approved quotes can be booked");
       }

       if (quote.getExpiresAt() != null && LocalDateTime.now().isAfter(quote.getExpiresAt())) {
           quote.setStatus(QuoteStatus.EXPIRED);
           quoteRequestRepository.save(quote);
           throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This quote has expired");
       }

       if (bookingRepository.findByQuote(quote).isPresent()) {
           throw new ResponseStatusException(HttpStatus.CONFLICT, "This quote has already been booked");
       }

       Booking booking = new Booking();
       booking.setCustomer(user);
       booking.setQuote(quote);
       booking.setRoute(quote.getOrigin() + " → " + quote.getDestination());
       booking.setVehicle(quote.getRequestedVehicle());
       booking.setAmount(quote.getAmount());
       booking.setStatus(BookingStatus.PAYMENT_PENDING);
       booking.setBookingCode("BK" + System.currentTimeMillis());
       Booking saved = bookingRepository.save(booking);

       Map<String, Object> response = new LinkedHashMap<>();
       response.put("bookingId", saved.getBookingCode());
       response.put("quoteId", quote.getReferenceCode());
       response.put("customer", user.getName());
       response.put("route", saved.getRoute());
       response.put("vehicle", saved.getVehicle());
       response.put("amount", saved.getAmount());
       response.put("status", saved.getStatus().name());
       response.put("bookingDate", saved.getBookingDate());
       return ResponseEntity.ok(response);
   }

   @PostMapping("/payments")
   public ResponseEntity<Map<String, Object>> createPayment(
       Authentication authentication,
       @RequestBody Map<String, Object> payload
   ) {
       User user = currentUser(authentication);

       String bookingCode = String.valueOf(payload.getOrDefault("bookingCode", "")).trim();
       if (bookingCode.isBlank()) {
           throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking code is required");
       }

       Booking booking = bookingRepository.findByBookingCode(bookingCode)
           .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

       if (!booking.getCustomer().getId().equals(user.getId())) {
           throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Booking does not belong to this customer");
       }

       if (paymentRepository.findByBooking(booking).isPresent()) {
           throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment already exists for this booking");
       }

       String method = String.valueOf(payload.getOrDefault("method", "UPI")).trim().toUpperCase();
       String transactionReference = String.valueOf(payload.getOrDefault("transactionReference", payload.getOrDefault("transactionId", "TXN" + System.currentTimeMillis()))).trim();
       String statusValue = String.valueOf(payload.getOrDefault("status", "PENDING")).trim().toUpperCase();
       PaymentStatus status = PaymentStatus.valueOf(statusValue.replace("PAID", "SUCCESS"));

       Payment payment = new Payment();
       payment.setCustomer(user);
       payment.setBooking(booking);
       payment.setQuoteReference(booking.getQuote().getReferenceCode());
       payment.setAmount(booking.getAmount());
       payment.setMethod(method);
       payment.setTransactionReference(transactionReference);
       payment.setStatus(status);

       if (status == PaymentStatus.SUCCESS) {
           booking.setStatus(BookingStatus.CONFIRMED);
           bookingRepository.save(booking);

           Shipment existingShipment = shipmentRepository.findByBooking(booking).orElse(null);
           if (existingShipment == null) {
               Shipment shipment = new Shipment();
               shipment.setBooking(booking);
               shipment.setCustomer(user);
               shipment.setOrigin(booking.getRoute().contains("→")
                   ? booking.getRoute().split("→", 2)[0].trim()
                   : booking.getRoute());
               shipment.setDestination(booking.getRoute().contains("→")
                   ? booking.getRoute().split("→", 2)[1].trim()
                   : booking.getRoute());
               shipment.setVehicleRegistration(booking.getVehicle() != null ? booking.getVehicle() : "MH12 AB 1234");
               shipment.setShipmentDate(LocalDateTime.now());
               shipment.setEstimatedDelivery(LocalDateTime.now().plusDays(2));
               shipment.setStatus(ShipmentStatus.PENDING);
               shipmentRepository.save(shipment);
               // publish shipment created event
               try {
                   eventPublisher.publishEvent(new com.goLogistic.notification.events.ShipmentCreatedEvent(this, shipment));
               } catch (Exception ex) {
                   // don't fail the request if event publishing fails
               }
           }
       }

       Payment saved = paymentRepository.save(payment);

       // publish payment received event for successful payments
       try {
           if (saved.getStatus() == com.goLogistic.payment.PaymentStatus.SUCCESS) {
               eventPublisher.publishEvent(new com.goLogistic.notification.events.PaymentReceivedEvent(this, saved));
           }
       } catch (Exception ex) {
           // best-effort
       }

       return ResponseEntity.status(HttpStatus.CREATED).body(toPaymentMap(saved));
   }

   @GetMapping("/bookings")
   public ResponseEntity<List<Map<String, Object>>> getMyBookings(Authentication authentication) {
       User user = currentUser(authentication);
       List<Booking> bookings = bookingRepository.findAll().stream()
           .filter(booking -> booking.getCustomer().getId().equals(user.getId()))
           .sorted((left, right) -> right.getBookingDate().compareTo(left.getBookingDate()))
           .toList();
       return ResponseEntity.ok(bookings.stream().map(this::toBookingMap).toList());
   }

   @GetMapping("/bookings/{bookingCode}")
   public ResponseEntity<Map<String, Object>> getBookingByCode(
       Authentication authentication,
       @PathVariable String bookingCode
   ) {
       User user = currentUser(authentication);
       Booking booking = bookingRepository.findByBookingCode(bookingCode)
           .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

       if (!booking.getCustomer().getId().equals(user.getId())) {
           throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Booking does not belong to this customer");
       }

       return ResponseEntity.ok(toBookingMap(booking));
   }

   @GetMapping("/shipments")
   public ResponseEntity<List<Map<String, Object>>> getMyShipments(Authentication authentication) {
       User user = currentUser(authentication);
       List<Shipment> shipments = shipmentRepository.findAll().stream()
           .filter(shipment -> shipment.getCustomer().getId().equals(user.getId()))
           .sorted((left, right) -> right.getShipmentDate().compareTo(left.getShipmentDate()))
           .toList();
       return ResponseEntity.ok(shipments.stream().map(this::toShipmentMap).toList());
   }

   @GetMapping("/shipments/{trackingCode}")
   public ResponseEntity<Map<String, Object>> getShipmentByTrackingCode(
       Authentication authentication,
       @PathVariable String trackingCode
   ) {
       User user = currentUser(authentication);
       Shipment shipment = shipmentRepository.findByTrackingCode(trackingCode)
           .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Shipment not found"));

       if (!shipment.getCustomer().getId().equals(user.getId())) {
           throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Shipment does not belong to this customer");
       }

       return ResponseEntity.ok(toShipmentMap(shipment));
   }

   @GetMapping("/payments")
   public ResponseEntity<List<Map<String, Object>>> getMyPayments(Authentication authentication) {
       User user = currentUser(authentication);
       List<Payment> payments = paymentRepository.findAll().stream()
           .filter(payment -> payment.getCustomer().getId().equals(user.getId()))
           .sorted((left, right) -> right.getPaymentDate().compareTo(left.getPaymentDate()))
           .toList();
       return ResponseEntity.ok(payments.stream().map(this::toPaymentMap).toList());
   }

   @PutMapping("/me")
   public ResponseEntity<Map<String, Object>> updateProfile(
       Authentication authentication,
       @Valid @RequestBody UpdateProfileRequest request
   ) {
       User user = currentUser(authentication);

       user.setName(request.name().trim());
       user.setPhone(request.phone().trim());
       user.setCompanyName(normalize(request.companyName()));
       user.setAddress(normalize(request.address()));
       user.setCity(normalize(request.city()));
       user.setState(normalize(request.state()));
       user.setPincode(normalize(request.pincode()));

       userRepository.save(user);
       return ResponseEntity.ok(toProfileMap(user));
   }

   private User currentUser(Authentication authentication) {
       String email = authentication.getName();
       User user = userRepository.findByEmailIgnoreCase(email)
           .orElseThrow(() -> new IllegalArgumentException("User not found"));

       if (user.getRole() != Role.CUSTOMER) {
           throw new IllegalArgumentException("Customer access required");
       }

       return user;
   }

   private Map<String, Object> toBookingMap(Booking booking) {
       Map<String, Object> item = new LinkedHashMap<>();
       item.put("id", booking.getBookingCode());
       item.put("quoteId", booking.getQuote() != null ? booking.getQuote().getReferenceCode() : null);
       item.put("route", booking.getRoute());
       item.put("vehicle", booking.getVehicle());
       item.put("amount", booking.getAmount());
       item.put("status", booking.getStatus().name());
       item.put("bookingDate", booking.getBookingDate());
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
       item.put("shipmentDate", shipment.getShipmentDate());
       item.put("estimatedDelivery", shipment.getEstimatedDelivery());
       item.put("status", shipment.getStatus().name());
       item.put("trackingHistory", shipment.getTrackingHistory() == null ? List.of() : shipment.getTrackingHistory().stream()
           .sorted((left, right) -> left.getTimestamp().compareTo(right.getTimestamp()))
           .map(event -> Map.of(
               "status", event.getStatus().name(),
               "timestamp", event.getTimestamp(),
               "message", event.getMessage()
           ))
           .toList());
       return item;
   }

   private Map<String, Object> toPaymentMap(Payment payment) {
       Map<String, Object> item = new LinkedHashMap<>();
       item.put("id", payment.getPaymentCode());
       item.put("bookingCode", payment.getBooking() != null ? payment.getBooking().getBookingCode() : null);
       item.put("quoteId", payment.getQuoteReference());
       item.put("customer", payment.getCustomer().getName());
       item.put("email", payment.getCustomer().getEmail());
       item.put("amount", payment.getAmount());
       item.put("method", payment.getMethod());
       item.put("transactionReference", payment.getTransactionReference());
       item.put("status", payment.getStatus().name());
       item.put("paymentDate", payment.getPaymentDate());
       return item;
   }

   private Map<String, Object> toProfileMap(User user) {
       Map<String, Object> profile = new LinkedHashMap<>();
       profile.put("id", user.getId());
       profile.put("name", user.getName());
       profile.put("email", user.getEmail());
       profile.put("phone", user.getPhone());
       profile.put("companyName", normalize(user.getCompanyName()));
       profile.put("address", normalize(user.getAddress()));
       profile.put("city", normalize(user.getCity()));
       profile.put("state", normalize(user.getState()));
       profile.put("pincode", normalize(user.getPincode()));
       profile.put("role", user.getRole().name());
       return profile;
   }

   private Map<String, Object> toQuoteMap(QuoteRequest quote) {
       Map<String, Object> item = new LinkedHashMap<>();
       item.put("id", quote.getReferenceCode());
       item.put("customerName", quote.getCustomerName());
       item.put("email", quote.getEmail());
       item.put("origin", quote.getOrigin());
       item.put("destination", quote.getDestination());
       item.put("cargo", quote.getCargo());
       item.put("weight", quote.getWeight());
       item.put("containerSize", quote.getContainerSize());
       item.put("requestedVehicle", quote.getRequestedVehicle());
       item.put("amount", quote.getAmount());
       item.put("status", quote.getStatus().name());
       item.put("requestedAt", quote.getRequestedAt());
       item.put("expiresAt", quote.getExpiresAt());
       return item;
   }

   public record CreateQuoteRequest(
       String origin,
       String destination,
       String cargo,
       String weight,
       String containerSize,
       String requestedVehicle,
       String amount
   ) {}

   private String normalize(String value) {
       return value == null ? "" : value.trim();
   }
}