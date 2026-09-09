package com.yourorg.appname.mapper;

import com.yourorg.appname.dto.response.UserResponse;
import com.yourorg.appname.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .phone(user.getPhone())
                .streetAddress(user.getStreetAddress())
                .aptSuite(user.getAptSuite())
                .city(user.getCity())
                .state(user.getState())
                .zipCode(user.getZipCode())
                .build();
    }
}
