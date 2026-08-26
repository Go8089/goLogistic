package com.goLogistic.shipment;

import com.goLogistic.booking.Booking;
import com.goLogistic.user.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "shipments")
public class Shipment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String trackingCode;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @Column(nullable = false)
    private String origin;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private String vehicleRegistration;

    @Column(nullable = false)
    private LocalDateTime shipmentDate;

    @Column(nullable = false)
    private LocalDateTime estimatedDelivery;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ShipmentStatus status = ShipmentStatus.PENDING;

    @OneToMany(mappedBy = "shipment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ShipmentTrackingEvent> trackingHistory = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (shipmentDate == null) {
            shipmentDate = LocalDateTime.now();
        }
        if (estimatedDelivery == null) {
            estimatedDelivery = shipmentDate.plusDays(2);
        }
        if (trackingCode == null || trackingCode.isBlank()) {
            trackingCode = "TRK" + System.currentTimeMillis();
        }
    }

    public UUID getId() {
        return id;
    }

    public String getTrackingCode() {
        return trackingCode;
    }

    public void setTrackingCode(String trackingCode) {
        this.trackingCode = trackingCode;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
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

    public String getVehicleRegistration() {
        return vehicleRegistration;
    }

    public void setVehicleRegistration(String vehicleRegistration) {
        this.vehicleRegistration = vehicleRegistration;
    }

    public LocalDateTime getShipmentDate() {
        return shipmentDate;
    }

    public void setShipmentDate(LocalDateTime shipmentDate) {
        this.shipmentDate = shipmentDate;
    }

    public LocalDateTime getEstimatedDelivery() {
        return estimatedDelivery;
    }

    public void setEstimatedDelivery(LocalDateTime estimatedDelivery) {
        this.estimatedDelivery = estimatedDelivery;
    }

    public ShipmentStatus getStatus() {
        return status;
    }

    public void setStatus(ShipmentStatus status) {
        this.status = status;
    }

    public List<ShipmentTrackingEvent> getTrackingHistory() {
        return trackingHistory;
    }

    public void setTrackingHistory(List<ShipmentTrackingEvent> trackingHistory) {
        this.trackingHistory = trackingHistory;
    }

    public void addTrackingEvent(ShipmentStatus status, String message) {
        ShipmentTrackingEvent event = new ShipmentTrackingEvent();
        event.setShipment(this);
        event.setStatus(status);
        event.setMessage(message);
        event.setTimestamp(LocalDateTime.now());
        this.trackingHistory.add(event);
    }
}
