package com.goLogistic.notification.events;

import com.goLogistic.payment.Payment;
import org.springframework.context.ApplicationEvent;

public class PaymentReceivedEvent extends ApplicationEvent {
    private final Payment payment;

    public PaymentReceivedEvent(Object source, Payment payment) {
        super(source);
        this.payment = payment;
    }

    public Payment getPayment() {
        return payment;
    }
}
