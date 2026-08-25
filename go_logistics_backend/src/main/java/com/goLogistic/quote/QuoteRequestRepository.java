package com.goLogistic.quote;

import com.goLogistic.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface QuoteRequestRepository extends JpaRepository<QuoteRequest, UUID> {
    Optional<QuoteRequest> findByReferenceCode(String referenceCode);
    List<QuoteRequest> findByCustomerOrderByRequestedAtDesc(User customer);
}
