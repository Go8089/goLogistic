package com.goLogistic.auth.otp;

import com.goLogistic.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OtpVerificationRepository
        extends JpaRepository<OtpVerification, UUID> {

    Optional<OtpVerification> findTopByUserAndTypeAndVerifiedFalseOrderByExpiresAtDesc(
        User user,
        OtpType type
    );
}