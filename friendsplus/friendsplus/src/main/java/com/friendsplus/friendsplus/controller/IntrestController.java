package com.friendsplus.friendsplus.controller;

import com.friendsplus.friendsplus.model.Interest;
import com.friendsplus.friendsplus.repository.InterestRepository;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/interests")
@CrossOrigin(origins = "http://localhost:5173")
public class IntrestController {

    private final InterestRepository interestRepository;

    public IntrestController(InterestRepository interestRepository) {
        this.interestRepository = interestRepository;
    }

    @GetMapping("/search")
    public List<Map<String, Object>> search(@RequestParam String q) {
        List<Object[]> results = interestRepository.searchWithPopularity(q);

        return results.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            Interest interest = (Interest) row[0]; // Cały obiekt Interest
            map.put("id", interest.getId());
            map.put("name", interest.getName());
            map.put("popularity", row[1]); // Wynik COUNT(u)
            return map;
        }).collect(Collectors.toList());
    }

    @GetMapping("/popular")
    public List<Map<String, Object>> getPopular() {
        List<Interest> popular = interestRepository.findPopular(org.springframework.data.domain.PageRequest.of(0, 3));
        return popular.stream().map(i -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", i.getId());
            map.put("name", i.getName());
            map.put("count", i.getUsers().size());
            return map;
        }).toList();
    }
    @GetMapping
    public List<Interest> getAll() {
        return interestRepository.findAll();
    }
}