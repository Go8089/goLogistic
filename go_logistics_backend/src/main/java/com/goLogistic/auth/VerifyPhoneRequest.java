package com.goLogistic.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record VerifyPhoneRequest(

    @NotBlank
    @Pattern(
        regexp = "^\\+91[6-9]\\d{9}$",
        message = "Enter a valid Indian mobile number"
    )
    String phone,

    @NotBlank
    @Pattern(
        regexp = "^\\d{6}$",
        message = "OTP must contain 6 digits"
    )
    String otp
) {}