package com.yourorg.appname.service;

import com.yourorg.appname.dto.request.ApplyPromoRequest;
import com.yourorg.appname.dto.response.PromoResponse;

public interface PromoService {
    PromoResponse validatePromo(ApplyPromoRequest request);
}
