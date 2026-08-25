package com.goLogistic.quote;

import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class QuoteSpecifications {

    private QuoteSpecifications() {
    }

    public static Specification<Quote> filter(
        String search,
        QuoteStatus status
    ) {
        return (root, query, cb) -> {

            List<Predicate> predicates =
                new ArrayList<>();

            if (search != null &&
                !search.isBlank()) {

                String value =
                    "%" + search.trim().toLowerCase() + "%";

                Predicate quoteId =
                    cb.like(
                        cb.lower(
                            root.get("id").as(String.class)
                        ),
                        value
                    );

                Predicate customerName =
                    cb.like(
                        cb.lower(
                            root
                                .join("customer")
                                .get("name")
                        ),
                        value
                    );

                Predicate customerEmail =
                    cb.like(
                        cb.lower(
                            root
                                .join("customer")
                                .get("email")
                        ),
                        value
                    );

                predicates.add(
                    cb.or(
                        quoteId,
                        customerName,
                        customerEmail
                    )
                );
            }

            if (status != null) {
                predicates.add(
                    cb.equal(
                        root.get("status"),
                        status
                    )
                );
            }

            return cb.and(
                predicates.toArray(
                    new Predicate[0]
                )
            );
        };
    }
}