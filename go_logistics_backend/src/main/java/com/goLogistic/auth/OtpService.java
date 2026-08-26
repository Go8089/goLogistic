package com.goLogistic.auth;

import com.goLogistic.aws.AwsNotificationService;
import com.goLogistic.exception.BadRequestException;
import com.goLogistic.otp.OtpPurpose;
import com.goLogistic.otp.OtpVerification;
import com.goLogistic.otp.OtpVerificationRepository;
import com.goLogistic.user.User;
import com.goLogistic.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.Locale;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    private static final int OTP_LENGTH = 6;
    private static final long OTP_TTL_SECONDS = 600L;
    private final OtpVerificationRepository otpRepository;
    private final UserRepository userRepository;
    private final AwsNotificationService awsNotificationService;
    private final PasswordEncoder passwordEncoder;

    public OtpService(
        OtpVerificationRepository otpRepository,
        UserRepository userRepository,
        AwsNotificationService awsNotificationService,
        PasswordEncoder passwordEncoder
    ) {
        this.otpRepository = otpRepository;
        this.userRepository = userRepository;
        this.awsNotificationService = awsNotificationService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void sendPasswordResetOtp(String contact, OtpChannel channel) {
        User user = resolveUserByContact(contact, channel);
        String otp = generateOtp();
        saveOtp(user.getEmail(), user.getPhone(), otp, OtpPurpose.PASSWORD_RESET);

        if (channel == OtpChannel.EMAIL) {
            String resetLink = "http://localhost:5173/reset-password?contact=" + user.getEmail() + "&channel=EMAIL";
            awsNotificationService.sendPasswordResetOtpEmail(user.getEmail(), otp, resetLink + "&otp=" + otp);
            awsNotificationService.sendPasswordResetEmail(user.getEmail(), resetLink + "&otp=" + otp);
            return;
        }

        String resetLink = "http://localhost:5173/reset-password?contact=" + user.getPhone() + "&channel=PHONE";
        awsNotificationService.sendOtpSms(user.getPhone(), otp);
        awsNotificationService.sendPasswordResetEmail(user.getEmail(), resetLink + "&otp=" + otp);
    }

    @Transactional
    public void verifyPasswordResetOtp(String contact, OtpChannel channel, String otpValue) {
        User user = resolveUserByContact(contact, channel);
        OtpPurpose purpose = OtpPurpose.PASSWORD_RESET;
        OtpVerification otp = getActiveOtp(user.getEmail(), purpose, otpValue, user.getPhone(), channel);
        otp.setVerifiedAt(Instant.now());
        otpRepository.save(otp);
    }

    @Transactional
    public void resetPassword(String contact, OtpChannel channel, String otpValue, String newPassword) {
        User user = resolveUserByContact(contact, channel);
        OtpVerification otp = getActiveOtp(user.getEmail(), OtpPurpose.PASSWORD_RESET, otpValue, user.getPhone(), channel);

        if (otp.isUsed()) {
            throw new BadRequestException("This OTP has already been used.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        otp.setVerifiedAt(Instant.now());
        otp.setUsed(true);
        otpRepository.save(otp);
    }

    @Transactional
    public void sendRegistrationOtp(String email, String phone, OtpChannel channel) {
        String normalizedEmail = normalizeEmail(email);
        String normalizedPhone = normalizePhone(phone);

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new BadRequestException("Email is already registered.");
        }

        if (StringUtils.hasText(normalizedPhone) && userRepository.findByPhone(normalizedPhone).isPresent()) {
            throw new BadRequestException("Phone number is already registered.");
        }

        String otp = generateOtp();
        OtpPurpose purpose = channel == OtpChannel.EMAIL ? OtpPurpose.EMAIL_VERIFICATION : OtpPurpose.PHONE_VERIFICATION;
        saveOtp(normalizedEmail, normalizedPhone, otp, purpose);

        if (channel == OtpChannel.EMAIL) {
            awsNotificationService.sendPasswordResetOtpEmail(normalizedEmail, otp, "http://localhost:5173/verify-email?email=" + normalizedEmail + "&otp=" + otp);
            return;
        }

        awsNotificationService.sendOtpSms(normalizedPhone, otp);
    }

    @Transactional
    public void verifyRegistrationOtp(String email, String phone, OtpChannel channel, String otpValue) {
        String normalizedEmail = normalizeEmail(email);
        String normalizedPhone = normalizePhone(phone);
        OtpPurpose purpose = channel == OtpChannel.EMAIL ? OtpPurpose.EMAIL_VERIFICATION : OtpPurpose.PHONE_VERIFICATION;
        OtpVerification otp = getActiveOtp(normalizedEmail, purpose, otpValue, normalizedPhone, channel);
        otp.setVerifiedAt(Instant.now());
        otpRepository.save(otp);
    }

    private User resolveUserByContact(String contact, OtpChannel channel) {
        if (channel == OtpChannel.EMAIL) {
            String normalizedEmail = normalizeEmail(contact);
            return userRepository
                .findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new BadRequestException("No account found with this email."));
        }

        String normalizedPhone = normalizePhone(contact);
        return userRepository
            .findByPhone(normalizedPhone)
            .orElseThrow(() -> new BadRequestException("No account found with this phone number."));
    }

    private OtpVerification getActiveOtp(String email, OtpPurpose purpose, String otpValue, String phone, OtpChannel channel) {
        String normalizedEmail = normalizeEmail(email);
        OtpVerification otp = otpRepository
            .findTopByEmailAndPurposeOrderByCreatedAtDesc(normalizedEmail, purpose)
            .orElseThrow(() -> new BadRequestException("No OTP was generated for this request."));

        if (channel == OtpChannel.PHONE && StringUtils.hasText(phone)) {
            String normalizedPhone = normalizePhone(phone);
            if (!normalizedPhone.equalsIgnoreCase(normalizePhone(otp.getPhone()))) {
                throw new BadRequestException("This OTP does not match the selected phone number.");
            }
        }

        if (otp.getExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException("This OTP has expired.");
        }

        if (!otp.getOtp().equals(otpValue.trim())) {
            throw new BadRequestException("Invalid OTP. Please check the code and try again.");
        }

        return otp;
    }

    private void saveOtp(String email, String phone, String otp, OtpPurpose purpose) {
        Optional<OtpVerification> latest = otpRepository
            .findTopByEmailAndPurposeOrderByCreatedAtDesc(normalizeEmail(email), purpose);

        latest.ifPresent(existing -> {
            existing.setUsed(true);
            otpRepository.save(existing);
        });

        OtpVerification verification = new OtpVerification();
        verification.setEmail(normalizeEmail(email));
        verification.setPhone(normalizePhone(phone));
        verification.setPurpose(purpose);
        verification.setOtp(otp);
        verification.setCreatedAt(Instant.now());
        verification.setExpiresAt(Instant.now().plusSeconds(OTP_TTL_SECONDS));
        verification.setUsed(false);
        otpRepository.save(verification);
    }

    private String generateOtp() {
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizePhone(String phone) {
        if (!StringUtils.hasText(phone)) {
            return "";
        }
        return phone.replaceAll("[^0-9+]", "").trim();
    }
}
