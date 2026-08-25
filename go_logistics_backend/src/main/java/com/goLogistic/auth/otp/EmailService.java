package com.goLogistic.auth.otp;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.*;

@Service
public class EmailService {

    private final SesClient sesClient;
    private final String senderEmail;

    public EmailService(
        SesClient sesClient,
        @Value("${ses.sender-email}") String senderEmail
    ) {
        this.sesClient = sesClient;
        this.senderEmail = senderEmail;
    }

    public void sendOtp(
        String recipient,
        String otp
    ) {
        Destination destination = Destination.builder()
            .toAddresses(recipient)
            .build();

        Content subject = Content.builder()
            .data("Go Logistics - Email Verification OTP")
            .build();

        Content bodyContent = Content.builder()
            .data("""
                Your Go Logistics verification OTP is:

                %s

                This OTP will expire in 5 minutes.

                If you did not request this code, please ignore
                this email.
                """.formatted(otp))
            .build();

        Body body = Body.builder()
            .text(bodyContent)
            .build();

        Message message = Message.builder()
            .subject(subject)
            .body(body)
            .build();

        SendEmailRequest request =
            SendEmailRequest.builder()
                .source(senderEmail)
                .destination(destination)
                .message(message)
                .build();

        sesClient.sendEmail(request);
    }
}