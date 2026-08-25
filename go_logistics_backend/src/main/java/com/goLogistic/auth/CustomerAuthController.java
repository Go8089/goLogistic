package com.goLogistic.auth;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/customer")
public class CustomerAuthController {

    private final CustomerAuthService customerAuthService;

    public CustomerAuthController(
        CustomerAuthService customerAuthService
    ) {
        this.customerAuthService = customerAuthService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
        @Valid @RequestBody RegisterRequest request
    ) {
        customerAuthService.register(request);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(
                new MessageResponse(
                    "Registration successful. Please verify your email."
                )
            );
    }

    @PostMapping("/verify-email")
public ResponseEntity<?> verifyEmail(
    @Valid @RequestBody VerifyEmailRequest request
) {
    customerAuthService.verifyEmail(request);

    return ResponseEntity.ok(
        new MessageResponse(
            "Email verified successfully"
        )
    );
}

@PostMapping("/verify-phone")
public ResponseEntity<?> verifyPhone(
    @Valid @RequestBody VerifyPhoneRequest request
) {
    customerAuthService.verifyPhone(request);

    return ResponseEntity.ok(
        new MessageResponse(
            "Phone number verified successfully"
        )
    );
}

@PostMapping("/forgot-password")
public ResponseEntity<?> forgotPassword(
    @Valid @RequestBody ForgotPasswordRequest request
) {
    customerAuthService.forgotPassword(request);

    return ResponseEntity.ok(
        new MessageResponse(
            "Password reset OTP sent to your email"
        )
    );
}

@PostMapping("/verify-reset-otp")
public ResponseEntity<?> verifyResetOtp(
    @Valid @RequestBody VerifyResetOtpRequest request
) {
    String resetToken =
        customerAuthService.verifyResetOtp(request);

    return ResponseEntity.ok(
        new ResetPasswordTokenResponse(resetToken)
    );
}

@PostMapping("/reset-password")
public ResponseEntity<?> resetPassword(
    @Valid @RequestBody ResetPasswordRequest request
) {
    customerAuthService.resetPassword(request);

    return ResponseEntity.ok(
        new MessageResponse(
            "Password reset successfully"
        )
    );
}
}