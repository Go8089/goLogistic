package com.goLogistic.notification;

import com.goLogistic.notification.events.PaymentReceivedEvent;
import com.goLogistic.notification.events.ShipmentCreatedEvent;
import com.goLogistic.payment.Payment;
import com.goLogistic.shipment.Shipment;
import com.goLogistic.aws.AwsNotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class NotificationEventListener {

    private static final Logger log = LoggerFactory.getLogger(NotificationEventListener.class);

    private final NotificationRepository notificationRepository;
    private final AwsNotificationService awsNotificationService;

    public NotificationEventListener(NotificationRepository notificationRepository, AwsNotificationService awsNotificationService) {
        this.notificationRepository = notificationRepository;
        this.awsNotificationService = awsNotificationService;
    }

    @EventListener
    public void onPaymentReceived(PaymentReceivedEvent event) {
        Payment payment = event.getPayment();
        try {
            Notification n = new Notification();
            n.setUser(payment.getCustomer());
            n.setType("PAYMENT_RECEIVED");
            n.setChannel("EMAIL");
            String message = String.format("Payment of %s received for booking %s.", payment.getAmount(), payment.getBooking() != null ? payment.getBooking().getBookingCode() : "N/A");
            n.setMessage(message);
            notificationRepository.save(n);

            // send email & optionally sms
            awsNotificationService.sendPasswordResetEmail(payment.getCustomer().getEmail(), message);

            n.setStatus(NotificationStatus.SENT);
            n.setSentAt(LocalDateTime.now());
            notificationRepository.save(n);
        } catch (Exception ex) {
            log.error("Failed to process payment received event", ex);
        }
    }

    @EventListener
    public void onShipmentCreated(ShipmentCreatedEvent event) {
        Shipment shipment = event.getShipment();
        try {
            Notification n = new Notification();
            n.setUser(shipment.getCustomer());
            n.setType("SHIPMENT_CREATED");
            n.setChannel("EMAIL");
            String message = String.format("Your shipment %s has been created and is pending pickup.", shipment.getTrackingCode());
            n.setMessage(message);
            notificationRepository.save(n);

            awsNotificationService.sendPasswordResetEmail(shipment.getCustomer().getEmail(), message);

            n.setStatus(NotificationStatus.SENT);
            n.setSentAt(LocalDateTime.now());
            notificationRepository.save(n);
        } catch (Exception ex) {
            log.error("Failed to process shipment created event", ex);
        }
    }
}
