package com.goLogistic.notification;

import com.goLogistic.notification.events.PaymentReceivedEvent;
import com.goLogistic.notification.events.ShipmentCreatedEvent;
import com.goLogistic.payment.Payment;
import com.goLogistic.shipment.Shipment;
import com.goLogistic.aws.AwsNotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class NotificationEventListener {

    private final SimpMessagingTemplate messagingTemplate;

    private static final Logger log = LoggerFactory.getLogger(NotificationEventListener.class);

    private final NotificationRepository notificationRepository;
    private final AwsNotificationService awsNotificationService;
    private final WhatsAppService whatsAppService;

    public NotificationEventListener(NotificationRepository notificationRepository, AwsNotificationService awsNotificationService, SimpMessagingTemplate messagingTemplate, WhatsAppService whatsAppService) {
        this.notificationRepository = notificationRepository;
        this.awsNotificationService = awsNotificationService;
        this.messagingTemplate = messagingTemplate;
        this.whatsAppService = whatsAppService;
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
            String subject = "Payment received — Go Logistics";
            String htmlBody = "<p>" + message + "</p>";
            String textBody = message;
            awsNotificationService.sendEmail(payment.getCustomer().getEmail(), subject, htmlBody, textBody);

            n.setStatus(NotificationStatus.SENT);
            n.setSentAt(LocalDateTime.now());
            notificationRepository.save(n);

            try {
                var payload = java.util.Map.of(
                    "id", n.getId(),
                    "type", n.getType(),
                    "message", n.getMessage(),
                    "status", n.getStatus().name(),
                    "createdAt", n.getCreatedAt()
                );
                messagingTemplate.convertAndSend("/topic/notifications/" + n.getUser().getId(), payload);
            } catch (Exception ex) {
                log.warn("Failed to push websocket notification", ex);
            }
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

            String subject = "Shipment created — Go Logistics";
            String htmlBody = "<p>" + message + "</p>";
            String textBody = message;
            awsNotificationService.sendEmail(shipment.getCustomer().getEmail(), subject, htmlBody, textBody);

            n.setStatus(NotificationStatus.SENT);
            n.setSentAt(LocalDateTime.now());
            notificationRepository.save(n);

            try {
                var payload = java.util.Map.of(
                    "id", n.getId(),
                    "type", n.getType(),
                    "message", n.getMessage(),
                    "status", n.getStatus().name(),
                    "createdAt", n.getCreatedAt()
                );
                messagingTemplate.convertAndSend("/topic/notifications/" + n.getUser().getId(), payload);
            } catch (Exception ex) {
                log.warn("Failed to push websocket notification", ex);
            }
        } catch (Exception ex) {
            log.error("Failed to process shipment created event", ex);
        }
    }
}
