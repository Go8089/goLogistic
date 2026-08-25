package com.goLogistic.quote;

import com.goLogistic.quote.dto.CreateQuoteRequest;
import com.goLogistic.quote.dto.QuoteHistoryResponse;
import com.goLogistic.quote.dto.QuoteResponse;
import com.goLogistic.user.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/quotes")
public class CustomerQuoteController {

    private final QuoteService quoteService;

    public CustomerQuoteController(
        QuoteService quoteService
    ) {
        this.quoteService = quoteService;
    }

    @PostMapping
    public ResponseEntity<QuoteResponse> createQuote(
        @Valid @RequestBody CreateQuoteRequest request,
        @AuthenticationPrincipal User customer
    ) {
        QuoteResponse response =
            quoteService.createQuote(
                request,
                customer
            );

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(response);
    }

    @GetMapping
    public ResponseEntity<List<QuoteResponse>> getQuotes(
        @AuthenticationPrincipal User customer
    ) {
        return ResponseEntity.ok(
            quoteService.getCustomerQuotes(customer)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuoteResponse> getQuote(
        @PathVariable UUID id,
        @AuthenticationPrincipal User customer
    ) {
        return ResponseEntity.ok(
            quoteService.getCustomerQuote(
                id,
                customer
            )
        );
    }
    @GetMapping("/{id}/history")
public ResponseEntity<List<QuoteHistoryResponse>> getHistory(
    @PathVariable UUID id,
    @AuthenticationPrincipal User customer
) {
    return ResponseEntity.ok(
        quoteService.getCustomerQuoteHistory(
            id,
            customer
        )
    );
}
@GetMapping("/{id}/pdf")
public ResponseEntity<byte[]> downloadPdf(
    @PathVariable UUID id,
    @AuthenticationPrincipal User customer
) {
    byte[] pdf =
        quoteService.generateCustomerQuotePdf(
            id,
            customer
        );

    return ResponseEntity.ok()
        .header(
            "Content-Disposition",
            "attachment; filename=\"quote-" +
                id +
                ".pdf\""
        )
        .header(
            "Content-Type",
            "application/pdf"
        )
        .body(pdf);
}
}