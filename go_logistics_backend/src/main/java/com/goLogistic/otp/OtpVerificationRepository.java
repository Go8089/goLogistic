package com.goLogistic.otp;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OtpVerificationRepository extends JpaRepository<OtpVerification, UUID> {

    Optional<OtpVerification> findTopByEmailAndPurposeOrderByCreatedAtDesc(String email, OtpPurpose purpose);

    Optional<OtpVerification> findTopByPhoneAndPurposeOrderByCreatedAtDesc(String phone, OtpPurpose purpose);
}
