package com.goLogistic.auth;

import com.goLogistic.user.User;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PasswordResetTokenService {

    private static final long EXPIRATION_SECONDS = 600;

    private final SecureRandom secureRandom = new SecureRandom();

    private final Map<String, ResetToken> tokens =
        new ConcurrentHashMap<>();

    public String createToken(User user) {

        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);

        String token = UUID.randomUUID() + "-" +
            UUID.nameUUIDFromBytes(bytes);

        tokens.put(
            token,
            new ResetToken(
                user.getId(),
                Instant.now().plusSeconds(
                    EXPIRATION_SECONDS
                )
            )
        );

        return token;
    }

    public UUID validateToken(String token) {

        ResetToken resetToken = tokens.get(token);

        if (resetToken == null) {
            throw new IllegalArgumentException(
                "Invalid reset token"
            );
        }

        if (Instant.now().isAfter(resetToken.expiresAt())) {
            tokens.remove(token);

            throw new IllegalArgumentException(
                "Reset token has expired"
            );
        }

        return resetToken.userId();
    }

    public void consumeToken(String token) {
        tokens.remove(token);
    }

    private record ResetToken(
        UUID userId,
        Instant expiresAt
    ) {}
}