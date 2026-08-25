package com.goLogistic.quote;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "quote_history")
public class QuoteHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "quote_id", nullable = false)
    private Quote quote;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuoteHistoryAction action;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuoteStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(length = 500)
    private String note;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public Quote getQuote() {
        return quote;
    }

    public void setQuote(Quote quote) {
        this.quote = quote;
    }

    public QuoteHistoryAction getAction() {
        return action;
    }

    public void setAction(QuoteHistoryAction action) {
        this.action = action;
    }

    public QuoteStatus getStatus() {
        return status;
    }

    public void setStatus(QuoteStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}