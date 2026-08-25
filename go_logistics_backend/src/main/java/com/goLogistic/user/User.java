package com.goLogistic.user;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
    name = "users",
    uniqueConstraints = @UniqueConstraint(columnNames = "email")
)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column
     private String companyName;

@Column
private String address;

@Column
private String city;

@Column
private String state;

@Column
private String pincode;

@Column(nullable = false)
private boolean emailVerified = false;

@Column(nullable = false)
private boolean phoneVerified = false;
    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();

        if (role == null) {
            role = Role.CUSTOMER;
        }
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getCompanyName() {
    return companyName;
}

public void setCompanyName(String companyName) {
    this.companyName = companyName;
}

public String getAddress() {
    return address;
}

public void setAddress(String address) {
    this.address = address;
}

public String getCity() {
    return city;
}

public void setCity(String city) {
    this.city = city;
}

public String getState() {
    return state;
}

public void setState(String state) {
    this.state = state;
}

public String getPincode() {
    return pincode;
}

public void setPincode(String pincode) {
    this.pincode = pincode;
}

public boolean isEmailVerified() {
    return emailVerified;
}

public void setEmailVerified(boolean emailVerified) {
    this.emailVerified = emailVerified;
}

public boolean isPhoneVerified() {
    return phoneVerified;
}

public void setPhoneVerified(boolean phoneVerified) {
    this.phoneVerified = phoneVerified;
}
}