package com.goLogistic.payment;

import com.goLogistic.booking.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    Optional<Payment> findByPaymentCode(String paymentCode);
    Optional<Payment> findByBooking(Booking booking);
    Optional<Payment> findByTransactionReference(String transactionReference);
}
