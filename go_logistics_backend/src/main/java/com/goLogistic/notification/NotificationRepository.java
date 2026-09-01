package com.goLogistic.notification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    java.util.List<Notification> findByUserOrderByCreatedAtDesc(com.goLogistic.user.User user);
}
