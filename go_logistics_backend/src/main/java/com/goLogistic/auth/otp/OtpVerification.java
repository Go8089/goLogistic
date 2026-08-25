package com.goLogistic.auth.otp;

import com.goLogistic.user.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "otp_verifications")
public class OtpVerification {

    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String otpHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OtpType type;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private int attempts = 0;

    @Column(nullable = false)
    private boolean verified = false;

    public UUID getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getOtpHash() {
        return otpHash;
    }

    public void setOtpHash(String otpHash) {
        this.otpHash = otpHash;
    }

    public OtpType getType() {
        return type;
    }

    public void setType(OtpType type) {
        this.type = type;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public int getAttempts() {
        return attempts;
    }

    public void setAttempts(int attempts) {
        this.attempts = attempts;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }
}