package com.goLogistic.quote;

import com.goLogistic.quote.dto.CreateQuoteRequest;
import com.goLogistic.quote.dto.QuoteHistoryResponse;
import com.goLogistic.quote.dto.QuoteResponse;
import com.goLogistic.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class QuoteService {

    private final QuoteRepository quoteRepository;
    private final QuoteHistoryRepository quoteHistoryRepository;
    private final QuotePdfService quotePdfService;
    public QuoteService(
        QuoteRepository quoteRepository,
        QuoteHistoryRepository quoteHistoryRepository,
        QuotePdfService quotePdfService
    ) {
        this.quoteRepository = quoteRepository;
        this.quoteHistoryRepository = quoteHistoryRepository;
        this.quotePdfService = quotePdfService;
    }

    @Transactional
    public QuoteResponse createQuote(
        CreateQuoteRequest request,
        User customer
    ) {
        if (request.validUntil()
            .isBefore(request.pickupDate())) {

            throw new IllegalArgumentException(
                "Valid until date cannot be before pickup date"
            );
        }

        Quote quote = new Quote();

        quote.setCustomer(customer);
        quote.setPickupLocation(
            request.pickupLocation()
        );
        quote.setDeliveryLocation(
            request.deliveryLocation()
        );
        quote.setCargoType(
            request.cargoType()
        );
        quote.setWeight(
            request.weight()
        );
        quote.setVehicleCategory(
            request.vehicleCategory()
        );
        quote.setBodyType(
            request.bodyType()
        );
        quote.setContainerSize(
            request.containerSize()
        );
        quote.setPickupDate(
            request.pickupDate()
        );
        quote.setValidUntil(
            request.validUntil()
        );

        quote.setTransportationCharge(
            request.transportationCharge()
        );
        quote.setHandlingCharge(
            request.handlingCharge()
        );
        quote.setTollCharge(
            request.tollCharge()
        );
        quote.setOtherCharges(
            request.otherCharges()
        );

        quote.calculateTotal();

       Quote savedQuote =
    quoteRepository.save(quote);

QuoteHistory history = new QuoteHistory();

history.setQuote(savedQuote);
history.setAction(
    QuoteHistoryAction.CREATED
);
history.setStatus(
    QuoteStatus.PENDING
);
history.setNote("Quote created by customer");

quoteHistoryRepository.save(history);

return QuoteResponse.from(savedQuote);
    }

    @Transactional(readOnly = true)
    public List<QuoteResponse> getCustomerQuotes(
        User customer
    ) {
        return quoteRepository
            .findByCustomerOrderByCreatedAtDesc(customer)
            .stream()
            .map(QuoteResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public QuoteResponse getCustomerQuote(
        UUID id,
        User customer
    ) {
        Quote quote = quoteRepository
            .findById(id)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Quote not found"
                )
            );

        if (!quote.getCustomer()
            .getId()
            .equals(customer.getId())) {

            throw new IllegalArgumentException(
                "You are not authorized to access this quote"
            );
        }

        return QuoteResponse.from(quote);
    }

    @Transactional(readOnly = true)
public List<QuoteHistoryResponse> getCustomerQuoteHistory(
    UUID quoteId,
    User customer
) {
    Quote quote = quoteRepository
        .findById(quoteId)
        .orElseThrow(() ->
            new IllegalArgumentException(
                "Quote not found"
            )
        );

    if (!quote.getCustomer().getId()
        .equals(customer.getId())) {

        throw new IllegalArgumentException(
            "You are not authorized to access this quote"
        );
    }

    return quoteHistoryRepository
        .findByQuoteOrderByCreatedAtDesc(quote)
        .stream()
        .map(QuoteHistoryResponse::from)
        .toList();
}

@Transactional(readOnly = true)
public byte[] generateCustomerQuotePdf(
    UUID quoteId,
    User customer
) {
    Quote quote = quoteRepository
        .findById(quoteId)
        .orElseThrow(() ->
            new IllegalArgumentException(
                "Quote not found"
            )
        );

    if (!quote.getCustomer()
        .getId()
        .equals(customer.getId())) {

        throw new IllegalArgumentException(
            "You are not authorized to access this quote"
        );
    }

    return quotePdfService.generatePdf(quote);
}
}