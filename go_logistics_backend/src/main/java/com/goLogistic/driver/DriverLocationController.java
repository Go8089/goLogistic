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

    private Double parseDouble(Object v) {
        if (v == null) return null;
        try {
            return Double.valueOf(String.valueOf(v));
        } catch (NumberFormatException ex) {
            return null;
        }
    }
}
