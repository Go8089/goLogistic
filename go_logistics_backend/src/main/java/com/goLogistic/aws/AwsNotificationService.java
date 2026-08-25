package com.goLogistic.aws;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ses.SesClient;
import software.amazon.awssdk.services.ses.model.Body;
import software.amazon.awssdk.services.ses.model.Content;
import software.amazon.awssdk.services.ses.model.Destination;
import software.amazon.awssdk.services.ses.model.Message;
import software.amazon.awssdk.services.ses.model.SendEmailRequest;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.PublishRequest;

@Service
public class AwsNotificationService {

    private static final Logger log = LoggerFactory.getLogger(AwsNotificationService.class);

    @Value("${aws.region:us-east-1}")
    private String region;

    @Value("${aws.access-key:}")
    private String accessKey;

    @Value("${aws.secret-key:}")
    private String secretKey;

    @Value("${aws.ses.enabled:false}")
    private boolean sesEnabled;

    @Value("${aws.ses.from-email:noreply@example.com}")
    private String fromEmail;

    @Value("${aws.sns.enabled:false}")
    private boolean snsEnabled;

    public boolean sendWelcomeEmail(String toEmail, String customerName) {
        String subject = "Welcome to Go Logistics";
        String htmlBody = "<h2>Welcome to Go Logistics</h2><p>Hi " + customerName + ",</p><p>Your account has been created successfully.</p>";
        String textBody = "Welcome to Go Logistics. Your account has been created successfully.";
        return sendEmail(toEmail, subject, htmlBody, textBody);
    }

    public boolean sendPasswordResetEmail(String toEmail, String resetLink) {
        String subject = "Reset your Go Logistics password";
        String htmlBody = "<h2>Reset your password</h2><p>Use this link to reset your password:</p><p><a href=\"" + resetLink + "\">Reset password</a></p>";
        String textBody = "Use this link to reset your password: " + resetLink;
        return sendEmail(toEmail, subject, htmlBody, textBody);
    }

    public boolean sendPasswordResetOtpEmail(String toEmail, String otp, String resetLink) {
        String subject = "Your Go Logistics password reset OTP";
        String htmlBody = "<h2>Your OTP code</h2><p>Your password reset code is <strong>" + otp + "</strong>.</p>"
            + "<p>Use this secure reset link:</p><p><a href=\"" + resetLink + "\">Reset password</a></p>";
        String textBody = "Your Go Logistics password reset code is " + otp + ". Use this link to continue: " + resetLink;
        return sendEmail(toEmail, subject, htmlBody, textBody);
    }

    public boolean sendOtpSms(String phoneNumber, String otp) {
        if (!StringUtils.hasText(phoneNumber)) {
            return false;
        }

        if (!snsEnabled || !hasAwsCredentials()) {
            log.info("AWS SNS is disabled or misconfigured; skip SMS to {}", phoneNumber);
            return false;
        }

        String readablePhone = phoneNumber.startsWith("+") ? phoneNumber : "+" + phoneNumber;

        try (SnsClient snsClient = createSnsClient()) {
            PublishRequest request = PublishRequest.builder()
                .phoneNumber(readablePhone)
                .message("Your Go Logistics OTP is: " + otp + ". Valid for 10 minutes.")
                .build();
            snsClient.publish(request);
            log.info("SMS OTP sent to {}", readablePhone);
            return true;
        } catch (Exception ex) {
            log.error("Failed to send SMS OTP to {}", readablePhone, ex);
            return false;
        }
    }

    public boolean sendEmail(String toEmail, String subject, String htmlBody, String textBody) {
        if (!StringUtils.hasText(toEmail)) {
            return false;
        }

        if (!sesEnabled || !hasAwsCredentials()) {
            log.info("AWS SES is disabled or misconfigured; skip email to {}", toEmail);
            return false;
        }

        try (SesClient sesClient = createSesClient()) {
            SendEmailRequest request = SendEmailRequest.builder()
                .source(fromEmail)
                .destination(Destination.builder().toAddresses(toEmail).build())
                .message(Message.builder()
                    .subject(Content.builder().data(subject).charset("UTF-8").build())
                    .body(Body.builder()
                        .html(Content.builder().data(htmlBody).charset("UTF-8").build())
                        .text(Content.builder().data(textBody).charset("UTF-8").build())
                        .build())
                    .build())
                .build();

            sesClient.sendEmail(request);
            log.info("SES email sent to {}", toEmail);
            return true;
        } catch (Exception ex) {
            log.error("Failed to send SES email to {}", toEmail, ex);
            return false;
        }
    }

    private boolean hasAwsCredentials() {
        return StringUtils.hasText(accessKey) && StringUtils.hasText(secretKey);
    }

    private SesClient createSesClient() {
        return SesClient.builder()
            .region(Region.of(region))
            .credentialsProvider(StaticCredentialsProvider.create(
                AwsBasicCredentials.create(accessKey, secretKey)
            ))
            .build();
    }

    private SnsClient createSnsClient() {
        return SnsClient.builder()
            .region(Region.of(region))
            .credentialsProvider(StaticCredentialsProvider.create(
                AwsBasicCredentials.create(accessKey, secretKey)
            ))
            .build();
    }
}
