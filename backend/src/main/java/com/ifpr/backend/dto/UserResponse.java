package com.ifpr.backend.dto;

import java.time.LocalDateTime;

import com.ifpr.backend.model.User;

public record UserResponse(Long id, String name, String email, LocalDateTime createdAt, LocalDateTime updatedAt) {
    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getCreatedAt(), user.getUpdatedAt());
    }
}
