package com.ifpr.backend.dto;

public record AuthResponse(String token, UserResponse user) {
}
