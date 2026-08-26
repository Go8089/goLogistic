package com.goLogistic.config;

import com.goLogistic.booking.Booking;
import com.goLogistic.booking.BookingRepository;
import com.goLogistic.booking.BookingStatus;
import com.goLogistic.payment.Payment;
import com.goLogistic.payment.PaymentRepository;
import com.goLogistic.payment.PaymentStatus;
import com.goLogistic.quote.QuoteRequest;
import com.goLogistic.quote.QuoteRequestRepository;
import com.goLogistic.quote.QuoteStatus;
import com.goLogistic.shipment.Shipment;
import com.goLogistic.shipment.ShipmentRepository;
import com.goLogistic.shipment.ShipmentStatus;
import com.goLogistic.user.Role;
import com.goLogistic.user.User;
import com.goLogistic.user.UserRepository;
import com.goLogistic.vehicle.Vehicle;
import com.goLogistic.vehicle.VehicleRepository;
import com.goLogistic.vehicle.VehicleStatus;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner createAdminAndSeedData(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        QuoteRequestRepository quoteRequestRepository,
        BookingRepository bookingRepository,
        ShipmentRepository shipmentRepository,
        PaymentRepository paymentRepository,
        VehicleRepository vehicleRepository
    ) {
        return args -> {
            String adminEmail = "admin@go-logistics.com";
            if (!userRepository.existsByEmailIgnoreCase(adminEmail)) {
                User admin = new User();
                admin.setName("Go Logistics Admin");
                admin.setEmail(adminEmail);
                admin.setPhone("9999999999");
                admin.setPassword(passwordEncoder.encode("Admin@12345"));
                admin.setRole(Role.ADMIN);
                admin.setEnabled(true);
                userRepository.save(admin);
            }

            User customer = userRepository.findByEmailIgnoreCase("rahul.sharma@example.com")
                .orElseGet(() -> {
                    User user = new User();
                    user.setName("Rahul Sharma");
                    user.setEmail("rahul.sharma@example.com");
                    user.setPhone("+91 98765 43210");
                    user.setPassword(passwordEncoder.encode("Customer@123"));
                    user.setRole(Role.CUSTOMER);
                    user.setEnabled(true);
                    return userRepository.save(user);
                });

            if (quoteRequestRepository.count() == 0) {
                QuoteRequest quote1 = new QuoteRequest();
                quote1.setReferenceCode("QT10021");
                quote1.setCustomer(customer);
                quote1.setCustomerName(customer.getName());
                quote1.setEmail(customer.getEmail());
                quote1.setOrigin("Pune, Maharashtra");
                quote1.setDestination("Mumbai, Maharashtra");
                quote1.setCargo("Commercial Goods");
                quote1.setWeight("850 kg");
                quote1.setContainerSize("20 ft");
                quote1.setRequestedVehicle("Container Truck");
                quote1.setAmount(new BigDecimal("18500"));
                quote1.setStatus(QuoteStatus.PENDING);
                quote1.setRequestedAt(LocalDateTime.now().minusDays(2));
                quoteRequestRepository.save(quote1);

                QuoteRequest quote2 = new QuoteRequest();
                quote2.setReferenceCode("QT10020");
                quote2.setCustomer(customer);
                quote2.setCustomerName(customer.getName());
                quote2.setEmail(customer.getEmail());
                quote2.setOrigin("Mumbai, Maharashtra");
                quote2.setDestination("Nashik, Maharashtra");
                quote2.setCargo("General Cargo");
                quote2.setWeight("620 kg");
                quote2.setContainerSize("17 ft");
                quote2.setRequestedVehicle("Truck");
                quote2.setAmount(new BigDecimal("22000"));
                quote2.setStatus(QuoteStatus.APPROVED);
                quote2.setRequestedAt(LocalDateTime.now().minusDays(3));
                quoteRequestRepository.save(quote2);
            }

            if (bookingRepository.count() == 0) {
                Booking booking1 = new Booking();
                booking1.setBookingCode("BK10001");
                booking1.setCustomer(customer);
                booking1.setRoute("Pune → Mumbai");
                booking1.setVehicle("20 ft Truck");
                booking1.setBookingDate(LocalDateTime.now().minusDays(1));
                booking1.setAmount(new BigDecimal("18500"));
                booking1.setStatus(BookingStatus.CONFIRMED);
                bookingRepository.save(booking1);

                Booking booking2 = new Booking();
                booking2.setBookingCode("BK10002");
                booking2.setCustomer(customer);
                booking2.setRoute("Pune → Nagpur");
                booking2.setVehicle("32 ft Truck");
                booking2.setBookingDate(LocalDateTime.now().minusDays(2));
                booking2.setAmount(new BigDecimal("32000"));
                booking2.setStatus(BookingStatus.PAYMENT_PENDING);
                bookingRepository.save(booking2);
            }

            if (shipmentRepository.count() == 0) {
                Booking booking = bookingRepository.findByBookingCode("BK10001").orElseGet(() -> bookingRepository.findAll().stream().findFirst().orElseThrow());
                Shipment shipment1 = new Shipment();
                shipment1.setTrackingCode("TRK10001");
                shipment1.setBooking(booking);
                shipment1.setCustomer(customer);
                shipment1.setOrigin("Pune, Maharashtra");
                shipment1.setDestination("Mumbai, Maharashtra");
                shipment1.setVehicleRegistration("MH12 AB 1234");
                shipment1.setShipmentDate(LocalDateTime.now().minusDays(2));
                shipment1.setEstimatedDelivery(LocalDateTime.now().plusDays(2));
                shipment1.setStatus(ShipmentStatus.IN_TRANSIT);
                shipmentRepository.save(shipment1);
            }

            if (paymentRepository.count() == 0) {
                Payment payment1 = new Payment();
                payment1.setPaymentCode("PAY10001");
                payment1.setCustomer(customer);
                payment1.setQuoteReference("QT10021");
                payment1.setAmount(new BigDecimal("18500"));
                payment1.setMethod("UPI");
                payment1.setPaymentDate(LocalDateTime.now().minusDays(1));
                payment1.setStatus(PaymentStatus.SUCCESS);
                paymentRepository.save(payment1);
            }

            if (vehicleRepository.count() == 0) {
                Vehicle vehicle1 = new Vehicle();
                vehicle1.setRegistrationNumber("MH12 AB 1234");
                vehicle1.setVehicleType("Truck");
                vehicle1.setContainerSize("20 ft");
                vehicle1.setCapacity("7 Ton");
                vehicle1.setDriver("Rajesh Kumar");
                vehicle1.setStatus(VehicleStatus.ASSIGNED);
                vehicleRepository.save(vehicle1);

                Vehicle vehicle2 = new Vehicle();
                vehicle2.setRegistrationNumber("MH12 CD 5678");
                vehicle2.setVehicleType("Truck");
                vehicle2.setContainerSize("32 ft");
                vehicle2.setCapacity("15 Ton");
                vehicle2.setDriver("Amit Singh");
                vehicle2.setStatus(VehicleStatus.AVAILABLE);
                vehicleRepository.save(vehicle2);

                Vehicle vehicle3 = new Vehicle();
                vehicle3.setRegistrationNumber("MH12 EF 9012");
                vehicle3.setVehicleType("Container Truck");
                vehicle3.setContainerSize("24 ft");
                vehicle3.setCapacity("10 Ton");
                vehicle3.setDriver("Suresh Patil");
                vehicle3.setStatus(VehicleStatus.MAINTENANCE);
                vehicleRepository.save(vehicle3);
            }
        };
    }
}
