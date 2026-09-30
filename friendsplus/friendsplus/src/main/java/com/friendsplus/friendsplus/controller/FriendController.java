package com.friendsplus.friendsplus.controller;

import com.friendsplus.friendsplus.model.*;
import com.friendsplus.friendsplus.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/friends")
@CrossOrigin(origins = "http://localhost:5173")
public class FriendController {

    private final UserRepository userRepository;
    private final FriendRepository friendRepository;
    private final NotificationRepository notificationRepository;

    public FriendController(UserRepository userRepository, FriendRepository friendRepository, NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.friendRepository = friendRepository;
        this.notificationRepository = notificationRepository;
    }


    @PostMapping("/request")
    public ResponseEntity<?> sendRequest(@RequestParam Long fromId, @RequestParam Long toId) {
        User from = userRepository.findById(fromId).orElseThrow(() -> new RuntimeException("Nadawca nie istnieje"));
        User to = userRepository.findById(toId).orElseThrow(() -> new RuntimeException("Odbiorca nie istnieje"));


        Optional<Friendship> existing = friendRepository.findRelation(fromId, toId);

        if (existing.isPresent()) {
            Friendship f = existing.get();

            if (f.getStatus().equals("pending") || f.getStatus().equals("accepted")) {
                return ResponseEntity.badRequest().body("Zaproszenie już oczekuje lub jesteście znajomymi");
            }

            f.setStatus("pending");
            f.setUser(from);
            f.setFriend(to);
            friendRepository.save(f);
        } else {

            friendRepository.save(new Friendship(from, to, "pending"));
        }


        notificationRepository.save(new Notification(to, "Użytkownik " + from.getUsername() + " wysłał Ci zaproszenie do znajomych", "FRIEND_REQUEST", fromId));

        return ResponseEntity.ok("Zaproszenie wysłane!");
    }


    @GetMapping("/blocked/{userId}")
    public List<User> getBlockedList(@PathVariable Long userId) {
        return friendRepository.findAll().stream()
                .filter(f -> f.getStatus().equals("blocked") && f.getUser().getId().equals(userId))
                .map(Friendship::getFriend)
                .collect(Collectors.toList());
    }


    @DeleteMapping("/unblock")
    public ResponseEntity<?> unblock(@RequestParam Long u1, @RequestParam Long u2) {
        friendRepository.findRelation(u1, u2).ifPresent(friendRepository::delete);
        return ResponseEntity.ok("Użytkownik odblokowany - możesz go teraz ponownie dodać");
    }


    @PostMapping("/block")
    public ResponseEntity<?> blockUser(@RequestParam Long u1, @RequestParam Long u2) {
        Friendship f = friendRepository.findRelation(u1, u2)
                .orElse(new Friendship(userRepository.findById(u1).get(), userRepository.findById(u2).get(), "blocked"));
        f.setStatus("blocked");
        f.setUser(userRepository.findById(u1).get()); // Ten kto blokuje jest 'user'
        f.setFriend(userRepository.findById(u2).get());
        friendRepository.save(f);

        notificationRepository.save(new Notification(f.getFriend(), "Zostałeś zablokowany przez " + f.getUser().getUsername(), "USER_BLOCKED", u1));

        return ResponseEntity.ok("Zablokowano");
    }


    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFriend(@RequestParam Long u1, @RequestParam Long u2) {
        friendRepository.findRelation(u1, u2).ifPresent(f -> {
            String senderName = userRepository.findById(u1).get().getUsername();
            User receiver = f.getUser().getId().equals(u1) ? f.getFriend() : f.getUser();
            notificationRepository.save(new Notification(receiver, senderName + " usunął Cię ze znajomych", "USER_REMOVED", u1));
            friendRepository.delete(f);
        });
        return ResponseEntity.ok("Usunięto znajomość");
    }


    @GetMapping("/status")
    public ResponseEntity<String> getStatus(@RequestParam Long u1, @RequestParam Long u2) {
        return friendRepository.findRelation(u1, u2)
                .map(f -> ResponseEntity.ok(f.getStatus()))
                .orElse(ResponseEntity.ok("NONE"));
    }


    @GetMapping("/list/{userId}")
    public List<User> getFriendsList(@PathVariable Long userId) {
        return friendRepository.findAcceptedFriends(userId).stream()
                .map(f -> f.getUser().getId().equals(userId) ? f.getFriend() : f.getUser())
                .toList();
    }


    @GetMapping("/pending/{userId}")
    public List<Friendship> getPending(@PathVariable Long userId) {
        User me = userRepository.findById(userId).orElseThrow();
        return friendRepository.findByFriendAndStatus(me, "pending");
    }


    @PostMapping("/respond")
    public ResponseEntity<?> respond(@RequestParam Long friendshipId, @RequestParam String status) {
        friendRepository.findById(friendshipId).ifPresent(f -> {
            f.setStatus(status);
            friendRepository.save(f);
        });
        return ResponseEntity.ok("OK");
    }
}