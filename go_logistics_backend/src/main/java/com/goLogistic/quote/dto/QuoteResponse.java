package com.goLogistic.quote.dto;

import com.goLogistic.quote.Quote;
import com.goLogistic.quote.QuoteStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record QuoteResponse(
    UUID id,
    QuoteStatus status,
    String pickupLocation,
    String deliveryLocation,
    String cargoType,
    String weight,
    String vehicleCategory,
    String bodyType,
    String containerSize,
    LocalDate pickupDate,
    LocalDate validUntil,
    BigDecimal transportationCharge,
    BigDecimal handlingCharge,
    BigDecimal tollCharge,
    BigDecimal otherCharges,
    BigDecimal totalAmount,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {

    public static QuoteResponse from(Quote quote) {
        return new QuoteResponse(
            quote.getId(),
            quote.getStatus(),
            quote.getPickupLocation(),
            quote.getDeliveryLocation(),
            quote.getCargoType(),
            quote.getWeight(),
            quote.getVehicleCategory(),
            quote.getBodyType(),
            quote.getContainerSize(),
            quote.getPickupDate(),
            quote.getValidUntil(),
            quote.getTransportationCharge(),
            quote.getHandlingCharge(),
            quote.getTollCharge(),
            quote.getOtherCharges(),
            quote.getTotalAmount(),
            quote.getCreatedAt(),
            quote.getUpdatedAt()
        );
    }
}