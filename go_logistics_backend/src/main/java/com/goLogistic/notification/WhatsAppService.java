package com.goLogistic.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class WhatsAppService {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppService.class);

    /**
     * Send a WhatsApp message via a Business API integration.
     * This is a stub implementation — replace with an actual provider client.
     */
    public boolean sendWhatsAppMessage(String phoneNumber, String message) {
        log.info("[WhatsApp stub] send to {}: {}", phoneNumber, message);
        // TODO: integrate with WhatsApp Business API or provider
        return false;
    }
}
