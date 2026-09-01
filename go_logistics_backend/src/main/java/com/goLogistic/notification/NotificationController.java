package com.goLogistic.notification;

import com.goLogistic.user.User;
import com.goLogistic.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationController(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> myNotifications(Authentication authentication) {
        User user = userRepository.findByEmailIgnoreCase(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        List<Notification> list = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        List<Map<String, Object>> payload = list.stream().map(n -> {
            Map<String, Object> m = new java.util.LinkedHashMap<>();
            m.put("id", n.getId());
            m.put("type", n.getType());
            m.put("channel", n.getChannel());
            m.put("message", n.getMessage());
            m.put("status", n.getStatus().name());
            m.put("createdAt", n.getCreatedAt());
            m.put("sentAt", n.getSentAt());
            return m;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(payload);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markRead(@PathVariable UUID id, Authentication authentication) {
        Notification n = notificationRepository.findById(id).orElse(null);
        if (n == null) return ResponseEntity.notFound().build();
        if (!n.getUser().getEmail().equalsIgnoreCase(authentication.getName())) return ResponseEntity.status(403).build();

        n.setStatus(NotificationStatus.READ);
        notificationRepository.save(n);
        return ResponseEntity.ok().build();
    }
}
