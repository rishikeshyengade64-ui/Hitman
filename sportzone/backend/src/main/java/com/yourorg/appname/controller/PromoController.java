package com.yourorg.appname.controller;

import com.yourorg.appname.dto.request.ApplyPromoRequest;
import com.yourorg.appname.dto.response.PromoResponse;
import com.yourorg.appname.service.PromoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/promos")
@RequiredArgsConstructor
public class PromoController {

    private final PromoService promoService;

    @PostMapping("/validate")
    public ResponseEntity<PromoResponse> validatePromo(@Valid @RequestBody ApplyPromoRequest request) {
        return ResponseEntity.ok(promoService.validatePromo(request));
    }
}
