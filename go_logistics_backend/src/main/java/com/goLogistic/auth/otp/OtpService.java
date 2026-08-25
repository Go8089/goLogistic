package com.goLogistic.auth.otp;

import com.goLogistic.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class OtpService {

    private final OtpVerificationRepository otpRepository;
    private final PasswordEncoder passwordEncoder;

    private final int expirationMinutes;
    private final int maxAttempts;

    private final SecureRandom secureRandom = new SecureRandom();
    private final EmailService emailService;
    private final SmsService smsService;
    public OtpService(
        OtpVerificationRepository otpRepository,
        PasswordEncoder passwordEncoder,
        EmailService emailService,
        SmsService smsService,
        @Value("${otp.expiration-minutes}") int expirationMinutes,
        @Value("${otp.max-attempts}") int maxAttempts
    ) {
        this.otpRepository = otpRepository;
        this.passwordEncoder = passwordEncoder;
        this.expirationMinutes = expirationMinutes;
        this.maxAttempts = maxAttempts;
        this.emailService = emailService;
        this.smsService = smsService;
    }

    @Transactional
    public String generateOtp(
        User user,
        OtpType type
    ) {

        String otp = String.format(
            "%06d",
            secureRandom.nextInt(1_000_000)
        );

        OtpVerification verification =
            new OtpVerification();

        verification.setUser(user);

        verification.setOtpHash(
            passwordEncoder.encode(otp)
        );

        verification.setType(type);

        verification.setExpiresAt(
            LocalDateTime.now()
                .plusMinutes(expirationMinutes)
        );

        verification.setAttempts(0);
        verification.setVerified(false);

        otpRepository.save(verification);

       if (type == OtpType.EMAIL || type == OtpType.PASSWORD_RESET) {
        emailService.sendOtp(
        user.getEmail(),
        otp);
    }

       if (type == OtpType.PHONE) {
         smsService.sendOtp(
          user.getPhone(),
          otp
         );
        }

        return otp;
    }

    @Transactional
    public void verifyOtp(
        User user,
        OtpType type,
        String otp
    ) {

        OtpVerification verification =
            otpRepository
                .findTopByUserAndTypeAndVerifiedFalseOrderByExpiresAtDesc(
                    user,
                    type
                )
                .orElseThrow(() ->
                    new IllegalArgumentException(
                        "OTP not found or already verified"
                    )
                );

        if (
            verification.getExpiresAt()
                .isBefore(LocalDateTime.now())
        ) {
            throw new IllegalArgumentException(
                "OTP has expired"
            );
        }

        if (
            verification.getAttempts()
                >= maxAttempts
        ) {
            throw new IllegalArgumentException(
                "Maximum OTP attempts exceeded"
            );
        }

        verification.setAttempts(
            verification.getAttempts() + 1
        );

        if (
            !passwordEncoder.matches(
                otp,
                verification.getOtpHash()
            )
        ) {
            otpRepository.save(verification);

            throw new IllegalArgumentException(
                "Invalid OTP"
            );
        }

        verification.setVerified(true);

        otpRepository.save(verification);
    }
}