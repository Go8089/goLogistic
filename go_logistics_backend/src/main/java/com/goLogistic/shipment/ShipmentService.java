package com.goLogistic.shipment;

import com.goLogistic.booking.Booking;
import com.goLogistic.user.User;
import com.goLogistic.notification.events.ShipmentCreatedEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final ApplicationEventPublisher eventPublisher;

    public ShipmentService(ShipmentRepository shipmentRepository, ApplicationEventPublisher eventPublisher) {
        this.shipmentRepository = shipmentRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public Shipment createShipmentForBooking(Booking booking, User customer) {
        // Return existing shipment if present
        var existing = shipmentRepository.findByBooking(booking).orElse(null);
        if (existing != null) {
            return existing;
        }

        Shipment shipment = new Shipment();
        shipment.setBooking(booking);
        shipment.setCustomer(customer);

        String route = booking.getRoute() != null ? booking.getRoute() : "";
        shipment.setOrigin(route.contains("→") ? route.split("→", 2)[0].trim() : route);
        shipment.setDestination(route.contains("→") ? route.split("→", 2)[1].trim() : route);
        shipment.setVehicleRegistration(booking.getVehicle() != null ? booking.getVehicle() : "");
        shipment.setShipmentDate(LocalDateTime.now());
        shipment.setEstimatedDelivery(LocalDateTime.now().plusDays(2));
        shipment.setStatus(ShipmentStatus.PENDING);

        Shipment saved = shipmentRepository.save(shipment);

        // publish event
        try {
            eventPublisher.publishEvent(new ShipmentCreatedEvent(this, saved));
        } catch (Exception ex) {
            // best-effort
        }

        return saved;
    }
}
