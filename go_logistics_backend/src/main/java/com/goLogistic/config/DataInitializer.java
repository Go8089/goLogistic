package com.goLogistic.config;

import com.goLogistic.user.Role;
import com.goLogistic.user.User;
import com.goLogistic.user.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createAdmin(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder
    ) {
        return args -> {

            String email = "admin@go-logistics.com";

            if (!userRepository.existsByEmail(email)) {

                User admin = new User();

                admin.setName("Go Logistics Admin");
                admin.setEmail(email);
                admin.setPhone("9999999999");
                admin.setPassword(
                    passwordEncoder.encode("Admin@12345")
                );
                admin.setRole(Role.ADMIN);

                userRepository.save(admin);
            }
        };
    }
}