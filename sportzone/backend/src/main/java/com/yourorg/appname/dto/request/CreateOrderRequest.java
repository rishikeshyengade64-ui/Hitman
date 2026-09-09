package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    @NotBlank(message = "First name is required")
    private String shippingFirstName;

    @NotBlank(message = "Last name is required")
    private String shippingLastName;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    private String shippingApt;

    @NotBlank(message = "City is required")
    private String shippingCity;

    @NotBlank(message = "State is required")
    private String shippingState;

    @NotBlank(message = "ZIP code is required")
    private String shippingZipCode;

    @NotBlank(message = "Phone is required")
    private String shippingPhone;

    private String shippingTier = "EXPRESS_STANDARD";
    private String paymentMethod = "CREDIT_CARD";
    private String promoCode;
}
