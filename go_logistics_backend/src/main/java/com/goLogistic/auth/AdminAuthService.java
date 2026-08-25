package com.goLogistic.auth;

import com.goLogistic.exception.BadRequestException;
import com.goLogistic.security.JwtService;
import com.goLogistic.user.Role;
import com.goLogistic.user.User;
import com.goLogistic.user.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AdminAuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository
            .findByEmailIgnoreCase(request.email().trim())
            .orElseThrow(() ->
                new BadRequestException("Invalid admin credentials")
            );

        if (!user.isEnabled()) {
            throw new BadRequestException("Admin account is disabled");
        }

        if (user.getRole() != Role.ADMIN) {
            throw new BadRequestException("Admin access denied");
        }

        if (!passwordEncoder.matches(
            request.password(),
            user.getPassword()
        )) {
            throw new BadRequestException("Invalid admin credentials");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
            token,
            user.getId().toString(),
            user.getName(),
            user.getEmail(),
            user.getRole().name()
        );
    }
}