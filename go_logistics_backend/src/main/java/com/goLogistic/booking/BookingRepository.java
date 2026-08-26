package com.goLogistic.booking;

import com.goLogistic.quote.QuoteRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    Optional<Booking> findByBookingCode(String bookingCode);
    Optional<Booking> findByQuote(QuoteRequest quote);
}
