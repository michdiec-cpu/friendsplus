package com.friendsplus.friendsplus.controller;

import com.friendsplus.friendsplus.dto.UpdateProfileRequest;
import com.friendsplus.friendsplus.model.Interest;
import com.friendsplus.friendsplus.model.User;
import com.friendsplus.friendsplus.repository.InterestRepository;
import com.friendsplus.friendsplus.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.*;
import java.util.UUID;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final InterestRepository interestRepository;

    public UserController(UserRepository userRepository, InterestRepository interestRepository) {
        this.userRepository = userRepository;
        this.interestRepository = interestRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{userId}/update-profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long userId, @RequestBody UpdateProfileRequest request) {
        return userRepository.findById(userId).map(user -> {

            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setPhoneNumber(request.getPhoneNumber());
            user.setLocation(request.getLocation());
            user.setAgeGroup(request.getAgeGroup());
            user.setProfileVisibility(request.getProfileVisibility());


            Set<Interest> updatedInterests = new HashSet<>();
            if (request.getInterestNames() != null) {
                for (String name : request.getInterestNames()) {
                    Interest interest = interestRepository.findByNameIgnoreCase(name)
                            .orElseGet(() -> {
                                Interest ni = new Interest();
                                ni.setName(name);
                                return interestRepository.save(ni);
                            });
                    updatedInterests.add(interest);
                }
            }
            user.setInterests(updatedInterests);

            User saved = userRepository.save(user);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam String q, @RequestParam Long currentUserId) {
        return userRepository.searchUsers(q, currentUserId);
    }

    @PostMapping("/{userId}/upload-photo")
    public ResponseEntity<?> uploadPhoto(@PathVariable Long userId, @RequestParam("file") MultipartFile file) {
        try {
            User user = userRepository.findById(userId).orElseThrow();


            Path uploadDir = Paths.get("uploads");
            if (!Files.exists(uploadDir)) Files.createDirectories(uploadDir);


            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadDir.resolve(fileName);


            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);


            String photoUrl = "http://localhost:8080/uploads/" + fileName;
            user.setProfilePhoto(photoUrl);
            userRepository.save(user);

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Błąd wgrywania: " + e.getMessage());
        }
    }
}