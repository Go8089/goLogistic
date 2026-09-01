package com.goLogistic.driver;

import com.goLogistic.booking.BookingRepository;
import com.goLogistic.shipment.ShipmentRepository;
import com.goLogistic.user.User;
import com.goLogistic.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;

@RestController
@RequestMapping("/api/driver")
public class DriverLocationController {

    private final DriverLocationRepository driverLocationRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final ShipmentRepository shipmentRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public DriverLocationController(DriverLocationRepository driverLocationRepository, UserRepository userRepository, BookingRepository bookingRepository, ShipmentRepository shipmentRepository, SimpMessagingTemplate messagingTemplate) {
        this.driverLocationRepository = driverLocationRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.shipmentRepository = shipmentRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping("/locations")
    public ResponseEntity<Map<String, Object>> postLocation(Authentication authentication, @RequestBody Map<String, Object> payload) {
        String email = authentication.getName();
        User driver = userRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "User not found"));

        // optionally ensure role DRIVER
        if (driver.getRole() != com.goLogistic.user.Role.DRIVER) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Driver role required");
        }

        Double lat = parseDouble(payload.get("latitude"));
        Double lon = parseDouble(payload.get("longitude"));
        if (lat == null || lon == null) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST, "latitude and longitude are required");
        }

        Double speed = parseDouble(payload.get("speed"));
        Double heading = parseDouble(payload.get("heading"));
        String vehicleRegistration = String.valueOf(payload.getOrDefault("vehicleRegistration", "")).trim();
        String shipmentTrackingCode = String.valueOf(payload.getOrDefault("shipmentTrackingCode", "")).trim();

        DriverLocation loc = new DriverLocation();
        loc.setDriver(driver);
        loc.setLatitude(lat);
        loc.setLongitude(lon);
        loc.setSpeed(speed);
        loc.setHeading(heading);
        if (!vehicleRegistration.isBlank()) loc.setVehicleRegistration(vehicleRegistration);
        if (!shipmentTrackingCode.isBlank()) loc.setShipmentTrackingCode(shipmentTrackingCode);

        driverLocationRepository.save(loc);

        // Broadcast to topics
        Map<String, Object> msg = Map.of(
            "driverId", driver.getId(),
            "latitude", lat,
            "longitude", lon,
            "speed", speed,
            "heading", heading,
            "timestamp", loc.getRecordedAt().toString()
        );

        // to driver-specific topic
        messagingTemplate.convertAndSend("/topic/drivers/" + driver.getId() + "/location", msg);

        // if shipment tracking code present, notify that shipment topic
        if (loc.getShipmentTrackingCode() != null && !loc.getShipmentTrackingCode().isBlank()) {
            messagingTemplate.convertAndSend("/topic/shipments/" + loc.getShipmentTrackingCode() + "/location", msg);
        }

        // if vehicle registration present, notify vehicle topic
        if (loc.getVehicleRegistration() != null && !loc.getVehicleRegistration().isBlank()) {
            messagingTemplate.convertAndSend("/topic/vehicles/" + loc.getVehicleRegistration() + "/location", msg);
        }

        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @PostMapping("/locations/batch")
    public ResponseEntity<Map<String, Object>> postLocationsBatch(Authentication authentication, @RequestBody List<Map<String, Object>> items) {
        String email = authentication.getName();
        User driver = userRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "User not found"));

        if (driver.getRole() != com.goLogistic.user.Role.DRIVER) {
            throw new ResponseStatusException(org.springframework.http.HttpStatus.FORBIDDEN, "Driver role required");
        }

        if (items == null || items.isEmpty()) return ResponseEntity.badRequest().body(Map.of("status", "empty"));

        List<DriverLocation> toSave = new java.util.ArrayList<>();

        for (Map<String, Object> payload : items) {
            Double lat = parseDouble(payload.get("latitude"));
            Double lon = parseDouble(payload.get("longitude"));
            if (lat == null || lon == null) continue; // skip invalid

            Double speed = parseDouble(payload.get("speed"));
            Double heading = parseDouble(payload.get("heading"));
            String vehicleRegistration = String.valueOf(payload.getOrDefault("vehicleRegistration", "")).trim();
            String shipmentTrackingCode = String.valueOf(payload.getOrDefault("shipmentTrackingCode", "")).trim();

            DriverLocation loc = new DriverLocation();
            loc.setDriver(driver);
            loc.setLatitude(lat);
            loc.setLongitude(lon);
            loc.setSpeed(speed);
            loc.setHeading(heading);
            if (!vehicleRegistration.isBlank()) loc.setVehicleRegistration(vehicleRegistration);
            if (!shipmentTrackingCode.isBlank()) loc.setShipmentTrackingCode(shipmentTrackingCode);

            // optionally parse recordedAt if client supplied
            Object recordedAtObj = payload.get("recordedAt");
            if (recordedAtObj instanceof String) {
                try {
                    loc.setRecordedAt(LocalDateTime.parse((String) recordedAtObj));
                } catch (DateTimeParseException ex) {
                    // ignore, let @PrePersist set timestamp
                }
            }

            toSave.add(loc);
        }

        if (!toSave.isEmpty()) {
            driverLocationRepository.saveAll(toSave);

            // broadcast each saved point
            for (DriverLocation loc : toSave) {
                Map<String, Object> msg = Map.of(
                    "driverId", driver.getId(),
                    "latitude", loc.getLatitude(),
                    "longitude", loc.getLongitude(),
                    "speed", loc.getSpeed(),
                    "heading", loc.getHeading(),
                    "timestamp", loc.getRecordedAt().toString()
                );

                messagingTemplate.convertAndSend("/topic/drivers/" + driver.getId() + "/location", msg);

                if (loc.getShipmentTrackingCode() != null && !loc.getShipmentTrackingCode().isBlank()) {
                    messagingTemplate.convertAndSend("/topic/shipments/" + loc.getShipmentTrackingCode() + "/location", msg);
                }

                if (loc.getVehicleRegistration() != null && !loc.getVehicleRegistration().isBlank()) {
                    messagingTemplate.convertAndSend("/topic/vehicles/" + loc.getVehicleRegistration() + "/location", msg);
                }
            }
        }

        return ResponseEntity.ok(Map.of("saved", toSave.size()));
    }

    @GetMapping("/{driverId}/latest")
    public ResponseEntity<Map<String, Object>> getLatestForDriver(@PathVariable("driverId") java.util.UUID driverId) {
        User driver = userRepository.findById(driverId).orElseThrow(() -> new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Driver not found"));
        java.util.Optional<DriverLocation> latest = driverLocationRepository.findTopByDriverOrderByRecordedAtDesc(driver);
        if (latest.isEmpty()) return ResponseEntity.notFound().build();
        DriverLocation loc = latest.get();
        return ResponseEntity.ok(Map.of(
            "driverId", driver.getId(),
            "latitude", loc.getLatitude(),
            "longitude", loc.getLongitude(),
            "speed", loc.getSpeed(),
            "heading", loc.getHeading(),
            "vehicleRegistration", loc.getVehicleRegistration(),
            "shipmentTrackingCode", loc.getShipmentTrackingCode(),
            "timestamp", loc.getRecordedAt().toString()
        ));
    }

    @GetMapping("/shipments/{trackingCode}/latest")
    public ResponseEntity<Map<String, Object>> getLatestForShipment(@PathVariable("trackingCode") String trackingCode) {
        java.util.Optional<DriverLocation> latest = driverLocationRepository.findTopByShipmentTrackingCodeOrderByRecordedAtDesc(trackingCode);
        if (latest.isEmpty()) return ResponseEntity.notFound().build();
        DriverLocation loc = latest.get();
        return ResponseEntity.ok(Map.of(
            "driverId", loc.getDriver().getId(),
            "latitude", loc.getLatitude(),
            "longitude", loc.getLongitude(),
            "speed", loc.getSpeed(),
            "heading", loc.getHeading(),
            "vehicleRegistration", loc.getVehicleRegistration(),
            "shipmentTrackingCode", loc.getShipmentTrackingCode(),
            "timestamp", loc.getRecordedAt().toString()
        ));
    }

    @GetMapping("/vehicles/{registration}/latest")
    public ResponseEntity<Map<String, Object>> getLatestForVehicle(@PathVariable("registration") String registration) {
        java.util.Optional<DriverLocation> latest = driverLocationRepository.findTopByVehicleRegistrationOrderByRecordedAtDesc(registration);
        if (latest.isEmpty()) return ResponseEntity.notFound().build();
        DriverLocation loc = latest.get();
        return ResponseEntity.ok(Map.of(
            "driverId", loc.getDriver().getId(),
            "latitude", loc.getLatitude(),
            "longitude", loc.getLongitude(),
            "speed", loc.getSpeed(),
            "heading", loc.getHeading(),
            "vehicleRegistration", loc.getVehicleRegistration(),
            "shipmentTrackingCode", loc.getShipmentTrackingCode(),
            "timestamp", loc.getRecordedAt().toString()
        ));
    }

    private Double parseDouble(Object v) {
        if (v == null) return null;
        try {
            return Double.valueOf(String.valueOf(v));
        } catch (NumberFormatException ex) {
            return null;
        }
    }
}
