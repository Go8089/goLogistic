package com.goLogistic.quote;

import com.goLogistic.quote.dto.QuoteHistoryResponse;
import com.goLogistic.quote.dto.QuoteResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/quotes")
@PreAuthorize("hasRole('ADMIN')")
public class AdminQuoteController {

    private final AdminQuoteService adminQuoteService;

    public AdminQuoteController(
        AdminQuoteService adminQuoteService
    ) {
        this.adminQuoteService = adminQuoteService;
    }

    @GetMapping
    public ResponseEntity<Page<QuoteResponse>> getQuotes(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) QuoteStatus status,
        Pageable pageable
    ) {
        return ResponseEntity.ok(
            adminQuoteService.getQuotes(
                search,
                status,
                pageable
            )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuoteResponse> getQuote(
        @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
            adminQuoteService.getQuote(id)
        );
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<QuoteResponse> approveQuote(
        @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
            adminQuoteService.approveQuote(id)
        );
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<QuoteResponse> rejectQuote(
        @PathVariable UUID id
    ) {
        return ResponseEntity.ok(
            adminQuoteService.rejectQuote(id)
        );
    }

    @GetMapping("/{id}/history")
public ResponseEntity<List<QuoteHistoryResponse>> getHistory(
    @PathVariable UUID id
) {
    return ResponseEntity.ok(
        adminQuoteService.getQuoteHistory(id)
    );
}

@GetMapping("/{id}/pdf")
public ResponseEntity<byte[]> downloadPdf(
    @PathVariable UUID id
) {
    byte[] pdf =
        adminQuoteService.generateQuotePdf(id);

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
