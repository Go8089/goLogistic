package com.goLogistic.payment;

import com.goLogistic.booking.Booking;
import com.goLogistic.booking.BookingRepository;
import com.goLogistic.notification.events.PaymentReceivedEvent;
import com.goLogistic.shipment.ShipmentService;
import com.goLogistic.shipment.Shipment;
import com.goLogistic.user.User;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final ShipmentService shipmentService;
    private final ApplicationEventPublisher eventPublisher;

    public PaymentService(PaymentRepository paymentRepository, BookingRepository bookingRepository, ShipmentService shipmentService, ApplicationEventPublisher eventPublisher) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.shipmentService = shipmentService;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public Payment createPayment(User user, Map<String, Object> payload) {
        String bookingCode = String.valueOf(payload.getOrDefault("bookingCode", "")).trim();
        if (bookingCode.isBlank()) {
            throw new IllegalArgumentException("Booking code is required");
        }

        Booking booking = bookingRepository.findByBookingCode(bookingCode).orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (!booking.getCustomer().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Booking does not belong to this customer");
        }

        if (paymentRepository.findByBooking(booking).isPresent()) {
            throw new IllegalStateException("Payment already exists for this booking");
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

        Payment saved = paymentRepository.save(payment);

        if (saved.getStatus() == PaymentStatus.SUCCESS) {
            booking.setStatus(com.goLogistic.booking.BookingStatus.CONFIRMED);
            bookingRepository.save(booking);

            // create shipment via ShipmentService
            Shipment created = shipmentService.createShipmentForBooking(booking, user);

            // publish payment received event
            try {
                eventPublisher.publishEvent(new PaymentReceivedEvent(this, saved));
            } catch (Exception ex) {
                // best-effort
            }
        }

        return saved;
    }

    @Transactional
    public Payment updatePaymentStatus(String paymentCode, String statusValue) {
        Payment payment = paymentRepository.findByPaymentCode(paymentCode).orElseThrow(() -> new IllegalArgumentException("Payment not found"));
        String normalized = statusValue.toUpperCase().replace("PAID", "SUCCESS");
        PaymentStatus newStatus = PaymentStatus.valueOf(normalized);
        payment.setStatus(newStatus);

        if (newStatus == PaymentStatus.SUCCESS && payment.getBooking() != null) {
            Booking booking = payment.getBooking();
            booking.setStatus(com.goLogistic.booking.BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
            shipmentService.createShipmentForBooking(booking, payment.getCustomer());

            try {
                eventPublisher.publishEvent(new PaymentReceivedEvent(this, payment));
            } catch (Exception ex) {
                // best-effort
            }
        }

        return paymentRepository.save(payment);
    }
}
