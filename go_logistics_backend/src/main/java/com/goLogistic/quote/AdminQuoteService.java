package com.goLogistic.quote;

import com.goLogistic.quote.dto.QuoteHistoryResponse;
import com.goLogistic.quote.dto.QuoteResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AdminQuoteService {

    private final QuoteRepository quoteRepository;
    private final QuoteHistoryRepository quoteHistoryRepository;
    private final QuotePdfService quotePdfService;
    public AdminQuoteService(
        QuoteRepository quoteRepository,
        QuoteHistoryRepository quoteHistoryRepository,
        QuotePdfService quotePdfService
    ) {
        this.quoteRepository = quoteRepository;
        this.quoteHistoryRepository = quoteHistoryRepository;
        this.quotePdfService = quotePdfService;
    }

    @Transactional(readOnly = true)
public Page<QuoteResponse> getQuotes(
    String search,
    QuoteStatus status,
    Pageable pageable
) {
    return quoteRepository
        .findAll(
            QuoteSpecifications.filter(
                search,
                status
            ),
            pageable
        )
        .map(QuoteResponse::from);
}

    @Transactional(readOnly = true)
    public QuoteResponse getQuote(UUID id) {

        Quote quote = quoteRepository
            .findById(id)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Quote not found"
                )
            );

        return QuoteResponse.from(quote);
    }

    @Transactional
    public QuoteResponse approveQuote(UUID id) {

        Quote quote = findQuote(id);

        if (quote.getStatus() == QuoteStatus.APPROVED) {
            throw new IllegalStateException(
                "Quote is already approved"
            );
        }

        if (quote.getStatus() == QuoteStatus.REJECTED) {
            throw new IllegalStateException(
                "Rejected quote cannot be approved"
            );
        }

        quote.setStatus(QuoteStatus.APPROVED);

Quote savedQuote =
    quoteRepository.save(quote);

QuoteHistory history = new QuoteHistory();

history.setQuote(savedQuote);
history.setAction(
    QuoteHistoryAction.APPROVED
);
history.setStatus(
    QuoteStatus.APPROVED
);
history.setNote("Quote approved by admin");

quoteHistoryRepository.save(history);

return QuoteResponse.from(savedQuote);
    }

    @Transactional
    public QuoteResponse rejectQuote(UUID id) {

        Quote quote = findQuote(id);

        if (quote.getStatus() == QuoteStatus.REJECTED) {
            throw new IllegalStateException(
                "Quote is already rejected"
            );
        }

        if (quote.getStatus() == QuoteStatus.APPROVED) {
            throw new IllegalStateException(
                "Approved quote cannot be rejected"
            );
        }

        quote.setStatus(QuoteStatus.REJECTED);

Quote savedQuote =
    quoteRepository.save(quote);

QuoteHistory history = new QuoteHistory();

history.setQuote(savedQuote);
history.setAction(
    QuoteHistoryAction.REJECTED
);
history.setStatus(
    QuoteStatus.REJECTED
);
history.setNote("Quote rejected by admin");

quoteHistoryRepository.save(history);

return QuoteResponse.from(savedQuote);
    }

    private Quote findQuote(UUID id) {
        return quoteRepository
            .findById(id)
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Quote not found"
                )
            );
    }
    @Transactional(readOnly = true)
public List<QuoteHistoryResponse> getQuoteHistory(
    UUID quoteId
) {
    Quote quote = quoteRepository
        .findById(quoteId)
        .orElseThrow(() ->
            new IllegalArgumentException(
                "Quote not found"
            )
        );

    return quoteHistoryRepository
        .findByQuoteOrderByCreatedAtDesc(quote)
        .stream()
        .map(QuoteHistoryResponse::from)
        .toList();
}

@Transactional(readOnly = true)
public byte[] generateQuotePdf(UUID quoteId) {

    Quote quote = quoteRepository
        .findById(quoteId)
        .orElseThrow(() ->
            new IllegalArgumentException(
                "Quote not found"
            )
        );

    return quotePdfService.generatePdf(quote);
}


}