package com.goLogistic.quote.dto;

import com.goLogistic.quote.QuoteHistory;
import com.goLogistic.quote.QuoteHistoryAction;
import com.goLogistic.quote.QuoteStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record QuoteHistoryResponse(
    UUID id,
    QuoteHistoryAction action,
    QuoteStatus status,
    String note,
    LocalDateTime createdAt
) {

    public static QuoteHistoryResponse from(
        QuoteHistory history
    ) {
        return new QuoteHistoryResponse(
            history.getId(),
            history.getAction(),
            history.getStatus(),
            history.getNote(),
            history.getCreatedAt()
        );
    }
}