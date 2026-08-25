package com.goLogistic.auth.otp;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.PublishRequest;

@Service
public class SmsService {

    private final SnsClient snsClient;

    public SmsService(SnsClient snsClient) {
        this.snsClient = snsClient;
    }

    public void sendOtp(
        String phone,
        String otp
    ) {
        String message = """
            Go Logistics verification OTP: %s

            This OTP expires in 5 minutes.
            Do not share this OTP with anyone.
            """.formatted(otp);

        PublishRequest request =
            PublishRequest.builder()
                .phoneNumber(phone)
                .message(message)
                .build();

        snsClient.publish(request);
    }
}