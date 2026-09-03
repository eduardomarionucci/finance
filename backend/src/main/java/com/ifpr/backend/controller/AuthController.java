package com.ifpr.backend.controller;

import com.ifpr.backend.dto.RegisterRequest;
import com.ifpr.backend.dto.AuthResponse;
import com.ifpr.backend.dto.LoginRequest;
import com.ifpr.backend.dto.UserResponse;
import com.ifpr.backend.model.User;
import com.ifpr.backend.service.JwtService;
import com.ifpr.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(UserService userService, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }   

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        User user = userService.register(request.name(), request.email(), request.password());
        Authentication authentication = authenticate(request.email(), request.password());
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(authentication, user));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        Authentication authentication = authenticate(request.email(), request.password());
        return ResponseEntity.ok(toResponse(authentication, userService.findByEmail(request.email())));
    }

    private Authentication authenticate(String email, String password) {
        return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
    }

    private AuthResponse toResponse(Authentication authentication, User user) {
        org.springframework.security.core.userdetails.UserDetails principal =
                (org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal();
        return new AuthResponse(jwtService.generateToken(principal), UserResponse.from(user));
    }
}
