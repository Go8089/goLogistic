package com.goLogistic.auth;

import com.goLogistic.auth.otp.OtpService;
import com.goLogistic.auth.otp.OtpType;
import com.goLogistic.user.Role;
import com.goLogistic.user.User;
import com.goLogistic.user.UserRepository;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final PasswordResetTokenService passwordResetTokenService;
    public CustomerAuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        OtpService otpService,
        PasswordResetTokenService passwordResetTokenService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpService = otpService;
        this.passwordResetTokenService = passwordResetTokenService;
    }

    @Transactional
    public void register(RegisterRequest request) {

        String email = request.email()
            .trim()
            .toLowerCase();

        if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new IllegalArgumentException(
                "Email is already registered"
            );
        }

        User user = new User();

        user.setName(request.name().trim());
        user.setEmail(email);
        user.setPhone(request.phone().trim());

        user.setPassword(
            passwordEncoder.encode(request.password())
        );

        user.setRole(Role.CUSTOMER);

        user.setEmailVerified(false);
        user.setPhoneVerified(false);

        User savedUser = userRepository.save(user);

        otpService.generateOtp(
            savedUser,
            OtpType.EMAIL
        );

        otpService.generateOtp(
        savedUser,
        OtpType.PHONE
       );
    }

    @Transactional
public void verifyEmail(VerifyEmailRequest request) {

    String email = request.email()
        .trim()
        .toLowerCase();

    User user = userRepository
        .findByEmailIgnoreCase(email)
        .orElseThrow(() ->
            new IllegalArgumentException(
                "User not found"
            )
        );

    if (user.isEmailVerified()) {
        throw new IllegalArgumentException(
            "Email is already verified"
        );
    }

    otpService.verifyOtp(
        user,
        OtpType.EMAIL,
        request.otp()
    );

    user.setEmailVerified(true);

    userRepository.save(user);
}

@Transactional
public void resendEmailOtp(ResendOtpRequest request) {

    String email = request.email()
        .trim()
        .toLowerCase();

    User user = userRepository
        .findByEmailIgnoreCase(email)
        .orElseThrow(() ->
            new IllegalArgumentException(
                "User not found"
            )
        );

    if (user.isEmailVerified()) {
        throw new IllegalArgumentException(
            "Email is already verified"
        );
    }

    otpService.generateOtp(
        user,
        OtpType.EMAIL
    );
}
@Transactional
public void verifyPhone(VerifyPhoneRequest request) {

    String phone = request.phone().trim();

    User user = userRepository
        .findByPhone(phone)
        .orElseThrow(() ->
            new IllegalArgumentException(
                "User not found"
            )
        );

    if (user.isPhoneVerified()) {
        throw new IllegalArgumentException(
            "Phone number is already verified"
        );
    }

    otpService.verifyOtp(
        user,
        OtpType.PHONE,
        request.otp()
    );

    user.setPhoneVerified(true);

    userRepository.save(user);
}

@Transactional
public void forgotPassword(ForgotPasswordRequest request) {

    String email = request.email()
        .trim()
        .toLowerCase();

    User user = userRepository
        .findByEmailIgnoreCase(email)
        .orElseThrow(() ->
            new IllegalArgumentException(
                "No account found with this email"
            )
        );

    otpService.generateOtp(
        user,
        OtpType.PASSWORD_RESET
    );
}
@Transactional
public String verifyResetOtp(
    VerifyResetOtpRequest request
) {
    String email = request.email()
        .trim()
        .toLowerCase();

    User user = userRepository
        .findByEmailIgnoreCase(email)
        .orElseThrow(() ->
            new IllegalArgumentException("User not found")
        );

    otpService.verifyOtp(
        user,
        OtpType.PASSWORD_RESET,
        request.otp()
    );

    return passwordResetTokenService.createToken(user);
}
@Transactional
public void resetPassword(
    ResetPasswordRequest request
) {
    UUID userId =
        passwordResetTokenService.validateToken(
            request.resetToken()
        );

    User user = userRepository
        .findById(userId)
        .orElseThrow(() ->
            new IllegalArgumentException(
                "User not found"
            )
        );

    user.setPassword(
        passwordEncoder.encode(
            request.newPassword()
        )
    );

    userRepository.save(user);

    passwordResetTokenService.consumeToken(
        request.resetToken()
    );
}
}