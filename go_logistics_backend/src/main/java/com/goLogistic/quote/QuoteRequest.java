package com.goLogistic.quote;

import com.goLogistic.user.User;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "quote_requests")
public class QuoteRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String referenceCode;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String origin;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private String cargo;

    @Column(nullable = false)
    private String weight;

    @Column(nullable = false)
    private String containerSize;

    @Column(nullable = false)
    private String requestedVehicle;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuoteStatus status = QuoteStatus.PENDING;

    @Column(nullable = false, updatable = false)
    private LocalDateTime requestedAt;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @PrePersist
    protected void onCreate() {
        if (requestedAt == null) {
            requestedAt = LocalDateTime.now();
        }
        if (expiresAt == null) {
            expiresAt = requestedAt.plusDays(7);
        }
        if (referenceCode == null || referenceCode.isBlank()) {
            referenceCode = "QT" + System.currentTimeMillis();
        }
    }

    public UUID getId() {
        return id;
    }

    public String getReferenceCode() {
        return referenceCode;
    }

    public void setReferenceCode(String referenceCode) {
        this.referenceCode = referenceCode;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }

    public String getContainerSize() {
        return containerSize;
    }

    public void setContainerSize(String containerSize) {
        this.containerSize = containerSize;
    }

    public String getRequestedVehicle() {
        return requestedVehicle;
    }

    public void setRequestedVehicle(String requestedVehicle) {
        this.requestedVehicle = requestedVehicle;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public QuoteStatus getStatus() {
        return status;
    }

    public void setStatus(QuoteStatus status) {
        this.status = status;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
}
