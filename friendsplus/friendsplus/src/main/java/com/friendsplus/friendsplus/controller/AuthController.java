package com.friendsplus.friendsplus.controller;

import com.friendsplus.friendsplus.dto.LoginRequest;
import com.friendsplus.friendsplus.dto.RegisterRequest;
import com.friendsplus.friendsplus.dto.VerifyRequest;
import com.friendsplus.friendsplus.model.Interest;
import com.friendsplus.friendsplus.model.User;
import com.friendsplus.friendsplus.repository.InterestRepository;
import com.friendsplus.friendsplus.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final InterestRepository interestRepository; // 1. DODANE POLE


    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          InterestRepository interestRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.interestRepository = interestRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email jest już zajęty");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));


        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setLocation(request.getLocation());
        user.setAgeGroup(request.getAgeGroup());
        user.setVerified(true);


        if (request.getInterestNames() != null && !request.getInterestNames().isEmpty()) {
            Set<Interest> interests = new HashSet<>();
            for (String name : request.getInterestNames()) {
                Interest interest = interestRepository.findByNameIgnoreCase(name)
                        .orElseGet(() -> {
                            Interest ni = new Interest();
                            ni.setName(name);
                            return interestRepository.save(ni);
                        });
                interests.add(interest);
            }
            user.setInterests(interests);
        }

        userRepository.save(user);
        return ResponseEntity.ok("Zarejestrowano pomyślnie");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return userRepository.findByEmail(request.getEmail())
                .map(user -> {
                    if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                        return ResponseEntity.ok(user);
                    }
                    return ResponseEntity.status(401).body("Błędne hasło");
                })
                .orElse(ResponseEntity.status(404).body("Użytkownik nie istnieje"));
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody VerifyRequest request) {
        return userRepository.findByEmail(request.getEmail())
                .map(user -> {
                    user.setVerified(true);
                    userRepository.save(user);
                    return ResponseEntity.ok("Konto zostało zweryfikowane");
                })
                .orElse(ResponseEntity.status(404).body("Użytkownik nie istnieje"));
    }
}