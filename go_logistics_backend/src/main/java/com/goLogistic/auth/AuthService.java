package com.goLogistic.auth;

import com.goLogistic.security.JwtService;
import com.goLogistic.user.Role;
import com.goLogistic.user.User;
import com.goLogistic.user.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public void register(RegisterRequest request) {

        String email = request.email().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException(
                "Email is already registered"
            );
        }

        User user = new User();

        user.setName(request.name());
        user.setEmail(email);
        user.setPassword(
            passwordEncoder.encode(request.password())
        );
        user.setPhone(request.phone());

        // Public registration can only create customers.
        user.setRole(Role.CUSTOMER);

        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository
            .findByEmail(
                request.email().toLowerCase()
            )
            .orElseThrow(() ->
                new IllegalArgumentException(
                    "Invalid email or password"
                )
            );

        if (!passwordEncoder.matches(
            request.password(),
            user.getPassword()
        )) {
            throw new IllegalArgumentException(
                "Invalid email or password"
            );
        }
        if (!user.isEmailVerified()) {
    throw new IllegalArgumentException(
        "Please verify your email before login"
    );
}

if (!user.isPhoneVerified()) {
    throw new IllegalArgumentException(
        "Please verify your mobile number before login"
    );
} 

        String token =
            jwtService.generateToken(user);

        return new AuthResponse(
            token,
            user.getId().toString(),
            user.getName(),
            user.getEmail(),
            user.getRole().name()
        );
    }
}