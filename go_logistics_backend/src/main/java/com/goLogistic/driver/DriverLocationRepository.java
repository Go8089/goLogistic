package com.goLogistic.driver;

import org.springframework.data.jpa.repository.JpaRepository;
import com.goLogistic.user.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DriverLocationRepository extends JpaRepository<DriverLocation, UUID> {
    Optional<DriverLocation> findTopByDriverOrderByRecordedAtDesc(User driver);
    List<DriverLocation> findByDriverOrderByRecordedAtDesc(User driver);
    Optional<DriverLocation> findTopByShipmentTrackingCodeOrderByRecordedAtDesc(String trackingCode);
}
