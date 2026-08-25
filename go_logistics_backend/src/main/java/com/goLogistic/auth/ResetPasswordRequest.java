package com.goLogistic.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(

    @NotBlank
    String resetToken,

    @NotBlank
    @Size(
        min = 8,
        message = "Password must contain at least 8 characters"
    )
    String newPassword
) {}

