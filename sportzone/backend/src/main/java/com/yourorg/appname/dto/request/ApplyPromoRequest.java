package com.yourorg.appname.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplyPromoRequest {

    @NotBlank(message = "Promo code is required")
    private String code;

    private BigDecimal orderAmount;
}
