package com.goLogistic.quote;

import com.goLogistic.user.User;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "quotes")
public class Quote {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuoteStatus status = QuoteStatus.PENDING;

    @Column(nullable = false)
    private String pickupLocation;

    @Column(nullable = false)
    private String deliveryLocation;

    @Column(nullable = false)
    private String cargoType;

    @Column(nullable = false)
    private String weight;

    @Column(nullable = false)
    private String vehicleCategory;

    private String bodyType;

    private String containerSize;

    @Column(nullable = false)
    private LocalDate pickupDate;

    @Column(nullable = false)
    private LocalDate validUntil;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal transportationCharge = BigDecimal.ZERO;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal handlingCharge = BigDecimal.ZERO;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal tollCharge = BigDecimal.ZERO;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal otherCharges = BigDecimal.ZERO;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
        calculateTotal();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateTotal();
    }

    public void calculateTotal() {
        totalAmount =
            transportationCharge
                .add(handlingCharge)
                .add(tollCharge)
                .add(otherCharges);
    }

    public UUID getId() {
        return id;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public QuoteStatus getStatus() {
        return status;
    }

    public void setStatus(QuoteStatus status) {
        this.status = status;
    }

    public String getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public String getDeliveryLocation() {
        return deliveryLocation;
    }

    public void setDeliveryLocation(String deliveryLocation) {
        this.deliveryLocation = deliveryLocation;
    }

    public String getCargoType() {
        return cargoType;
    }

    public void setCargoType(String cargoType) {
        this.cargoType = cargoType;
    }

    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }

    public String getVehicleCategory() {
        return vehicleCategory;
    }

    public void setVehicleCategory(String vehicleCategory) {
        this.vehicleCategory = vehicleCategory;
    }

    public String getBodyType() {
        return bodyType;
    }

    public void setBodyType(String bodyType) {
        this.bodyType = bodyType;
    }

    public String getContainerSize() {
        return containerSize;
    }

    public void setContainerSize(String containerSize) {
        this.containerSize = containerSize;
    }

    public LocalDate getPickupDate() {
        return pickupDate;
    }

    public void setPickupDate(LocalDate pickupDate) {
        this.pickupDate = pickupDate;
    }

    public LocalDate getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(LocalDate validUntil) {
        this.validUntil = validUntil;
    }

    public BigDecimal getTransportationCharge() {
        return transportationCharge;
    }

    public void setTransportationCharge(BigDecimal value) {
        this.transportationCharge = value;
    }

    public BigDecimal getHandlingCharge() {
        return handlingCharge;
    }

    public void setHandlingCharge(BigDecimal value) {
        this.handlingCharge = value;
    }

    public BigDecimal getTollCharge() {
        return tollCharge;
    }

    public void setTollCharge(BigDecimal value) {
        this.tollCharge = value;
    }

    public BigDecimal getOtherCharges() {
        return otherCharges;
    }

    public void setOtherCharges(BigDecimal value) {
        this.otherCharges = value;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
