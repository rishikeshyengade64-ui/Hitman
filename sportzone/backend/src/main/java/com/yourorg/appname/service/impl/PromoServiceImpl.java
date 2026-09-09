package com.yourorg.appname.service.impl;

import com.yourorg.appname.dto.request.ApplyPromoRequest;
import com.yourorg.appname.dto.response.PromoResponse;
import com.yourorg.appname.entity.PromoCode;
import com.yourorg.appname.repository.PromoCodeRepository;
import com.yourorg.appname.service.PromoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PromoServiceImpl implements PromoService {

    private final PromoCodeRepository promoCodeRepository;

    @Override
    @Transactional(readOnly = true)
    public PromoResponse validatePromo(ApplyPromoRequest request) {
        String code = request.getCode().trim();
        PromoCode promo = promoCodeRepository.findByCodeIgnoreCaseAndIsActiveTrue(code).orElse(null);

        if (promo == null) {
            return PromoResponse.builder()
                    .valid(false)
                    .code(code)
                    .message("Invalid or expired promo code.")
                    .build();
        }

        if (promo.getExpiryDate() != null && promo.getExpiryDate().isBefore(LocalDateTime.now())) {
            return PromoResponse.builder()
                    .valid(false)
                    .code(code)
                    .message("Promo code has expired.")
                    .build();
        }

        BigDecimal orderAmt = request.getOrderAmount() != null ? request.getOrderAmount() : BigDecimal.ZERO;
        if (orderAmt.compareTo(promo.getMinOrderAmount()) < 0) {
            return PromoResponse.builder()
                    .valid(false)
                    .code(code)
                    .message("Minimum order value of $" + promo.getMinOrderAmount() + " required.")
                    .build();
        }

        BigDecimal discountAmt = BigDecimal.ZERO;
        if (promo.getDiscountPercent() > 0) {
            discountAmt = orderAmt.multiply(BigDecimal.valueOf(promo.getDiscountPercent()))
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else if (promo.getDiscountAmount() != null) {
            discountAmt = promo.getDiscountAmount();
        }

        return PromoResponse.builder()
                .valid(true)
                .code(promo.getCode())
                .discountPercent(promo.getDiscountPercent())
                .discountAmount(discountAmt)
                .message("Promo code applied successfully!")
                .build();
    }
}
