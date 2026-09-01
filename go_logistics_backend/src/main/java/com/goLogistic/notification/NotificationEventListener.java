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

            com.goLogistic.notification.NotificationChannel pref = payment.getCustomer().getPreferredNotificationChannel();
            if (pref == null) pref = com.goLogistic.notification.NotificationChannel.EMAIL;
            n.setChannel(pref.name());

            String message = String.format("Payment of %s received for booking %s.", payment.getAmount(), payment.getBooking() != null ? payment.getBooking().getBookingCode() : "N/A");
            n.setMessage(message);
            notificationRepository.save(n);

            String subject = "Payment received — Go Logistics";
            String htmlBody = "<p>" + message + "</p>";
            String textBody = message;

            // send only via preferred channel
            switch (pref) {
                case SMS:
                    awsNotificationService.sendOtpSms(payment.getCustomer().getPhone(), message);
                    break;
                case WHATSAPP:
                    whatsAppService.sendWhatsAppMessage(payment.getCustomer().getPhone(), message);
                    break;
                case EMAIL:
                default:
                    awsNotificationService.sendEmail(payment.getCustomer().getEmail(), subject, htmlBody, textBody);
                    break;
            }

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

            com.goLogistic.notification.NotificationChannel pref = shipment.getCustomer().getPreferredNotificationChannel();
            if (pref == null) pref = com.goLogistic.notification.NotificationChannel.EMAIL;
            n.setChannel(pref.name());

            switch (pref) {
                case SMS:
                    awsNotificationService.sendOtpSms(shipment.getCustomer().getPhone(), message);
                    break;
                case WHATSAPP:
                    whatsAppService.sendWhatsAppMessage(shipment.getCustomer().getPhone(), message);
                    break;
                case EMAIL:
                default:
                    awsNotificationService.sendEmail(shipment.getCustomer().getEmail(), subject, htmlBody, textBody);
                    break;
            }

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
