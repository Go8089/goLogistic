package com.goLogistic.auth.dto;

import com.goLogistic.auth.OtpChannel;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequest(
    @NotBlank(message = "Contact is required")
    String contact,

    @NotBlank(message = "OTP delivery channel is required")
    OtpChannel channel
) {}
