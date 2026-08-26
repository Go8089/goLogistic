package com.goLogistic.auth.dto;

import com.goLogistic.auth.OtpChannel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record VerifyOtpRequest(
    @NotBlank(message = "Contact is required")
    String contact,

    @NotBlank(message = "OTP delivery channel is required")
    OtpChannel channel,

    @NotBlank(message = "OTP is required")
    @Pattern(regexp = "^[0-9]{6}$", message = "OTP must be 6 digits")
    String otp
) {}
