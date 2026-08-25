package com.goLogistic.quote.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateQuoteRequest(

    @NotBlank
    String pickupLocation,

    @NotBlank
    String deliveryLocation,

    @NotBlank
    String cargoType,

    @NotBlank
    String weight,

    @NotBlank
    String vehicleCategory,

    String bodyType,

    String containerSize,

    @NotNull
    @FutureOrPresent
    LocalDate pickupDate,

    @NotNull
    LocalDate validUntil,

    @NotNull
    @DecimalMin(value = "0.0")
    BigDecimal transportationCharge,

    @NotNull
    @DecimalMin(value = "0.0")
    BigDecimal handlingCharge,

    @NotNull
    @DecimalMin(value = "0.0")
    BigDecimal tollCharge,

    @NotNull
    @DecimalMin(value = "0.0")
    BigDecimal otherCharges
) {}