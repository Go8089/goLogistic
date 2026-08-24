package com.goLogistic.customer;

import com.goLogistic.user.User;
import com.goLogistic.user.UserRepository;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

    private final UserRepository userRepository;

    public CustomerController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
public ResponseEntity<?> me(
    Authentication authentication
) {
    User user = userRepository
        .findByEmail(authentication.getName())
        .orElseThrow();

    return ResponseEntity.ok(
        Map.of(
            "id", user.getId(),
            "name", user.getName(),
            "email", user.getEmail(),
            "phone", user.getPhone(),
            "companyName",
                user.getCompanyName() == null
                    ? ""
                    : user.getCompanyName(),
            "address",
                user.getAddress() == null
                    ? ""
                    : user.getAddress(),
            "city",
                user.getCity() == null
                    ? ""
                    : user.getCity(),
            "state",
                user.getState() == null
                    ? ""
                    : user.getState(),
            "pincode",
                user.getPincode() == null
                    ? ""
                    : user.getPincode(),
            "role", user.getRole()
        )
    );
}

    @PutMapping("/me")
public ResponseEntity<?> updateProfile(
    Authentication authentication,
    @Valid @RequestBody UpdateProfileRequest request
) {
    User user = userRepository
        .findByEmail(authentication.getName())
        .orElseThrow();

    user.setName(request.name());
    user.setPhone(request.phone());
    user.setCompanyName(request.companyName());
    user.setAddress(request.address());
    user.setCity(request.city());
    user.setState(request.state());
    user.setPincode(request.pincode());

    userRepository.save(user);

    return ResponseEntity.ok(
        Map.of(
            "id", user.getId(),
            "name", user.getName(),
            "email", user.getEmail(),
            "phone", user.getPhone(),
            "companyName",
                user.getCompanyName() == null
                    ? ""
                    : user.getCompanyName(),
            "address",
                user.getAddress() == null
                    ? ""
                    : user.getAddress(),
            "city",
                user.getCity() == null
                    ? ""
                    : user.getCity(),
            "state",
                user.getState() == null
                    ? ""
                    : user.getState(),
            "pincode",
                user.getPincode() == null
                    ? ""
                    : user.getPincode(),
            "role", user.getRole()
        )
    );
  }
    }