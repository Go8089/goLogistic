package com.goLogistic.quote;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface QuoteHistoryRepository
        extends JpaRepository<QuoteHistory, UUID> {

    List<QuoteHistory> findByQuoteOrderByCreatedAtDesc(
        Quote quote
    );
}