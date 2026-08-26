package com.goLogistic.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmailIgnoreCase(String email);

<<<<<<< HEAD
    boolean existsByEmail(String email);

    Optional<User> findByPhone(String phone);
=======
    Optional<User> findByPhone(String phone);

    boolean existsByEmailIgnoreCase(String email);

    default boolean existsByEmail(String email) {
        return existsByEmailIgnoreCase(email);
    }
>>>>>>> agents/help-me-fix-describe-the-bug-in-this
}