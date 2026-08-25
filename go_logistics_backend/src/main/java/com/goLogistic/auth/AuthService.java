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

    public void register(RegisterRequest request) {

        String email = request.email().trim();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new BadRequestException("Email is already registered");
        }

        otpService.verifyRegistrationOtp(email, request.phone(), request.otpChannel(), request.otp());

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(email.toLowerCase());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setPhone(request.phone().trim());
        user.setRole(Role.CUSTOMER);
        user.setEnabled(true);
        user.setEmailVerified(false);

        userRepository.save(user);

        try {
            awsNotificationService.sendWelcomeEmail(
                user.getEmail(),
                user.getName()
            );
        } catch (Exception ex) {
            log.warn("Welcome email could not be sent for {}: {}", user.getEmail(), ex.getMessage());
        }
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository
            .findByEmailIgnoreCase(request.email().trim())
            .orElseThrow(() ->
                new BadRequestException("Invalid email or password")
            );

        if (!user.isEnabled()) {
            throw new BadRequestException("Account is disabled");
        }

        if (!passwordEncoder.matches(
            request.password(),
            user.getPassword()
        )) {
            throw new BadRequestException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
            token,
            user.getId().toString(),
            user.getName(),
            user.getEmail(),
            user.getRole().name()
        );
    }

    public void forgotPassword(String contact, OtpChannel channel) {
        if (channel == OtpChannel.EMAIL) {
            String normalizedEmail = contact.trim();
            if (!userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
                return;
            }
        }

        otpService.sendPasswordResetOtp(contact, channel);
    }

    public void verifyResetOtp(String contact, OtpChannel channel, String otp) {
        otpService.verifyPasswordResetOtp(contact, channel, otp);
    }

    public void resetPassword(String contact, OtpChannel channel, String otp, String password) {
        otpService.resetPassword(contact, channel, otp, password);
    }

    public void sendRegistrationOtp(String email, String phone, OtpChannel channel) {
        otpService.sendRegistrationOtp(email, phone, channel);
    }
}