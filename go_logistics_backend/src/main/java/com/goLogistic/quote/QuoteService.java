package com.goLogistic.quote;

import com.goLogistic.user.User;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class QuoteService {

    private final QuoteRequestRepository quoteRequestRepository;

    public QuoteService(QuoteRequestRepository quoteRequestRepository) {
        this.quoteRequestRepository = quoteRequestRepository;
    }

    public QuoteRequest createQuote(User user, com.goLogistic.customer.CustomerController.CreateQuoteRequest request) {
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
        return quoteRequestRepository.save(quote);
    }

    public List<QuoteRequest> getQuotesForUser(User user) {
        return quoteRequestRepository.findByCustomerOrderByRequestedAtDesc(user);
    }

    public QuoteRequest findByReferenceCode(String referenceCode) {
        return quoteRequestRepository.findByReferenceCode(referenceCode).orElse(null);
    }
}
