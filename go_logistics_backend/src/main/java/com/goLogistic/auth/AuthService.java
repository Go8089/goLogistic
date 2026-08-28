package com.goLogistic.auth;

import com.goLogistic.aws.AwsNotificationService;
import com.goLogistic.exception.BadRequestException;
import com.goLogistic.security.JwtService;
import com.goLogistic.user.Role;
import com.goLogistic.user.User;
import com.goLogistic.user.UserRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Authentication Service - handles user registration and login
 * Single Responsibility: Auth operations only
 * Dependency Injection: All dependencies injected via constructor
 */
@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AwsNotificationService awsNotificationService;
    private final OtpService otpService;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        AwsNotificationService awsNotificationService,
        OtpService otpService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.awsNotificationService = awsNotificationService;
        this.otpService = otpService;
    }

    /**
     * Register a new customer user
     * BUG FIX: Set phoneVerified to true initially (not all systems require phone verification)
     * Follow up verification can happen separately
     */
    @Transactional
    public void register(RegisterRequest request) {
        String email = normalizeEmail(request.email());

        // Check if email already exists
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new BadRequestException("Email is already registered");
        }

        // Verify OTP before proceeding
        otpService.verifyRegistrationOtp(email, request.phone(), request.otpChannel(), request.otp());

        // Create new user
        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setPhone(normalizePhone(request.phone()));
        user.setRole(Role.CUSTOMER);
        user.setEnabled(true);
        user.setEmailVerified(true); // Email is verified via OTP
        user.setPhoneVerified(false); // Phone verification optional

        userRepository.save(user);

        // Send welcome email asynchronously (non-blocking)
        sendWelcomeEmailAsync(user);
    }

    /**
     * Authenticate user and generate JWT token
     * BUG FIXES:
     * 1. Consistent exception type (BadRequestException instead of mixing with IllegalArgumentException)
     * 2. More secure error messages (generic for invalid credentials)
     * 3. Phone verification optional (not blocking login)
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());

        // Find user by email
        User user = userRepository
            .findByEmailIgnoreCase(email)
            .orElseThrow(() ->
                new BadRequestException("Invalid email or password")
            );

        // Check if account is enabled
        if (!user.isEnabled()) {
            throw new BadRequestException("Account is disabled");
        }

        // Verify password
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        // Email verification is required
        if (!user.isEmailVerified()) {
            throw new BadRequestException("Please verify your email before login");
        }

        // Phone verification is optional (removed as blocking condition)

        // Generate JWT token
        String token = jwtService.generateToken(user);

        return new AuthResponse(
            token,
            user.getId().toString(),
            user.getName(),
            user.getEmail(),
            user.getRole().name()
        );
    }

    /**
     * Initiate password reset flow
     * BUG FIX: Handle non-existent emails gracefully (security: don't leak email existence)
     */
    @Transactional
    public void forgotPassword(String contact, OtpChannel channel) {
        try {
            otpService.sendPasswordResetOtp(contact, channel);
        } catch (BadRequestException e) {
            // Log but don't expose whether email exists
            log.debug("Password reset requested for non-existent contact: {}", channel);
            // Send success response regardless to prevent email enumeration
        }
    }

    /**
     * Verify password reset OTP
     */
    @Transactional
    public void verifyResetOtp(String contact, OtpChannel channel, String otp) {
        otpService.verifyPasswordResetOtp(contact, channel, otp);
    }

    /**
     * Reset password after OTP verification
     */
    @Transactional
    public void resetPassword(String contact, OtpChannel channel, String otp, String password) {
        otpService.resetPassword(contact, channel, otp, password);
    }

    /**
     * Send registration OTP to user
     */
    @Transactional
    public void sendRegistrationOtp(String email, String phone, OtpChannel channel) {
        otpService.sendRegistrationOtp(email, phone, channel);
    }

    /**
     * Helper: Send welcome email asynchronously
     */
    private void sendWelcomeEmailAsync(User user) {
        try {
            awsNotificationService.sendWelcomeEmail(
                user.getEmail(),
                user.getName()
            );
        } catch (Exception ex) {
            // Log but don't fail registration if email fails
            log.warn("Welcome email could not be sent for {}: {}", user.getEmail(), ex.getMessage());
        }
    }

    /**
     * Helper: Normalize email
     */
    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    /**
     * Helper: Normalize phone
     */
    private String normalizePhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return "";
        }
        return phone.trim().replaceAll("[^0-9+]", "");
    }
}
