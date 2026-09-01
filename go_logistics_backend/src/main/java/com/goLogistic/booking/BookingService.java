package com.goLogistic.booking;

import com.goLogistic.quote.QuoteRequest;
import com.goLogistic.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final com.goLogistic.quote.QuoteRequestRepository quoteRequestRepository;

    public BookingService(BookingRepository bookingRepository, com.goLogistic.quote.QuoteRequestRepository quoteRequestRepository) {
        this.bookingRepository = bookingRepository;
        this.quoteRequestRepository = quoteRequestRepository;
    }

    @Transactional
    public Booking createBookingFromQuote(User user, QuoteRequest quote) {
        if (!quote.getCustomer().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Quote does not belong to this customer");
        }

        if (quote.getStatus() != com.goLogistic.quote.QuoteStatus.APPROVED) {
            throw new IllegalStateException("Only approved quotes can be booked");
        }

        if (quote.getExpiresAt() != null && LocalDateTime.now().isAfter(quote.getExpiresAt())) {
            quote.setStatus(com.goLogistic.quote.QuoteStatus.EXPIRED);
            // persist the status change
            quoteRequestRepository.save(quote);
            throw new IllegalStateException("This quote has expired");
        }

        if (bookingRepository.findByQuote(quote).isPresent()) {
            throw new IllegalStateException("This quote has already been booked");
        }

        Booking booking = new Booking();
        booking.setCustomer(user);
        booking.setQuote(quote);
        booking.setRoute(quote.getOrigin() + " → " + quote.getDestination());
        booking.setVehicle(quote.getRequestedVehicle() != null ? quote.getRequestedVehicle() : "");
        booking.setAmount(quote.getAmount());
        booking.setStatus(BookingStatus.PAYMENT_PENDING);
        // bookingCode & bookingDate set on persist
        return bookingRepository.save(booking);
    }
}
