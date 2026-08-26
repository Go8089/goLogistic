package com.goLogistic.auth;

import com.goLogistic.auth.dto.ForgotPasswordRequest;
import com.goLogistic.auth.dto.ResetPasswordRequest;
import com.goLogistic.auth.dto.VerifyOtpRequest;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/send-otp")
    public Map<String, String> sendRegistrationOtp(@Valid @RequestBody RegisterOtpRequest request) {
        authService.sendRegistrationOtp(request.email(), request.phone(), request.otpChannel());
        return Map.of("message", "OTP sent successfully. Please verify the code to complete registration.");
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(
        @Valid @RequestBody RegisterRequest request
    ) {

        authService.register(request);

        return new AuthResponse(
            null,
            null,
            null,
            request.email(),
            "CUSTOMER"
        );
    }

    @PostMapping("/login")
    public AuthResponse login(
        @Valid @RequestBody LoginRequest request
    ) {
        return authService.login(request);
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(
        @Valid @RequestBody ForgotPasswordRequest request
    ) {
        authService.forgotPassword(request.contact(), request.channel());
        return Map.of(
            "message",
            "If an account exists for this contact, a password reset OTP has been sent."
        );
    }

    @PostMapping("/verify-reset-otp")
    public Map<String, String> verifyResetOtp(
        @Valid @RequestBody VerifyOtpRequest request
    ) {
        authService.verifyResetOtp(request.contact(), request.channel(), request.otp());
        return Map.of("message", "OTP verified successfully.");
    }

    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(
        @Valid @RequestBody ResetPasswordRequest request
    ) {
        authService.resetPassword(
            request.contact(),
            request.channel(),
            request.otp(),
            request.password()
        );
        return Map.of("message", "Password reset successfully.");
    }

    @GetMapping("/r")
    public String Come() {
        return "Go Logistics Backend is running!";
    }

}