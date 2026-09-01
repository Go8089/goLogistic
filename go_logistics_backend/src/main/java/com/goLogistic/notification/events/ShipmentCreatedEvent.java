package com.goLogistic.notification.events;

import com.goLogistic.shipment.Shipment;
import org.springframework.context.ApplicationEvent;

public class ShipmentCreatedEvent extends ApplicationEvent {
    private final Shipment shipment;

    public ShipmentCreatedEvent(Object source, Shipment shipment) {
        super(source);
        this.shipment = shipment;
    }

    public Shipment getShipment() {
        return shipment;
    }
}
