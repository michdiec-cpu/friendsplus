package com.friendsplus.friendsplus.controller;

import com.friendsplus.friendsplus.model.Activity;
import com.friendsplus.friendsplus.model.User;
import com.friendsplus.friendsplus.repository.ActivityRepository;
import com.friendsplus.friendsplus.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "http://localhost:5173")
public class ActivityController {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public ActivityController(ActivityRepository activityRepository, UserRepository userRepository) {
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/search")
    public List<Activity> search(@RequestParam String q) {
        return activityRepository.findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(q);
    }

    @GetMapping("/recent")
    public List<Activity> getRecent() {
        return activityRepository.findTop10ByOrderByCreatedAtDesc();
    }

    @PostMapping
    public Activity create(@RequestParam Long authorId, @RequestBody Activity activity) {
        User author = userRepository.findById(authorId).orElseThrow();
        activity.setAuthor(author);
        return activityRepository.save(activity);
    }
}