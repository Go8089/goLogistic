package com.goLogistic.customer;

import jakarta.validation.constraints.NotBlank;

public record UpdateProfileRequest(
    @NotBlank String name,
    @NotBlank String phone,
    String companyName,
    String address,
    String city,
    String state,
    String pincode
) {}