package com.yourorg.appname.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromoResponse {
    private boolean valid;
    private String code;
    private Integer discountPercent;
    private BigDecimal discountAmount;
    private String message;
}
