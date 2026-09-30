package com.friendsplus.friendsplus.controller;

import com.friendsplus.friendsplus.model.*;
import com.friendsplus.friendsplus.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ideas")
@CrossOrigin(origins = "http://localhost:5173")
public class IdeaController {

    private final IdeaRepository ideaRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final VoteRepository voteRepository;
    private final EventRepository eventRepository;
    private final NotificationRepository notificationRepository;

    public IdeaController(IdeaRepository ideaRepository, GroupRepository groupRepository,
                          UserRepository userRepository, VoteRepository voteRepository,
                          EventRepository eventRepository, NotificationRepository notificationRepository) {
        this.ideaRepository = ideaRepository;
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.voteRepository = voteRepository;
        this.eventRepository = eventRepository;
        this.notificationRepository = notificationRepository;
    }


    @GetMapping("/group/{groupId}")
    public List<Map<String, Object>> getGroupIdeas(@PathVariable Long groupId) {
        return ideaRepository.findByGroupIdOrderByIdDesc(groupId).stream().map(i -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", i.getId());
            map.put("title", i.getTitle());
            map.put("description", i.getDescription());
            map.put("location", i.getLocation());
            map.put("proposedDate", i.getProposedDate());
            map.put("status", i.getStatus());
            map.put("authorName", i.getAuthor() != null ? i.getAuthor().getUsername() : "Anonim");


            List<Map<String, Object>> voteList = i.getVotes().stream().map(v -> {
                Map<String, Object> vm = new HashMap<>();
                vm.put("userId", v.getUser().getId());
                vm.put("choice", v.isChoice());
                return vm;
            }).collect(Collectors.toList());
            map.put("votes", voteList);
            return map;
        }).collect(Collectors.toList());
    }


    @PostMapping("/propose")
    public ResponseEntity<?> proposeIdea(@RequestParam Long groupId, @RequestParam Long authorId, @RequestBody Idea idea) {
        Group g = groupRepository.findById(groupId).orElseThrow();
        User u = userRepository.findById(authorId).orElseThrow();
        idea.setGroup(g);
        idea.setAuthor(u);
        idea.setStatus("PROPOSED");
        ideaRepository.save(idea);
        return ResponseEntity.ok("Zapisano propozycję");
    }


    @PostMapping("/{id}/start-vote")
    public ResponseEntity<?> startVote(@PathVariable Long id, @RequestParam int hours) {
        Idea idea = ideaRepository.findById(id).orElseThrow();
        idea.setStatus("VOTING");
        idea.setVotingDeadline(LocalDateTime.now().plusHours(hours));
        ideaRepository.save(idea);
        return ResponseEntity.ok("Głosowanie rozpoczęte");
    }


    @PostMapping("/{id}/accept-directly")
    public ResponseEntity<?> acceptDirectly(@PathVariable Long id) {
        Idea idea = ideaRepository.findById(id).orElseThrow();
        idea.setStatus("ACCEPTED");

        Event e = new Event();
        e.setTitle(idea.getTitle());
        e.setLocation(idea.getLocation());
        e.setEventDate(idea.getProposedDate());
        e.setGroup(idea.getGroup());
        e.setCreator(idea.getAuthor());
        e.getParticipants().add(idea.getAuthor());
        eventRepository.save(e);
        ideaRepository.save(idea);

        return ResponseEntity.ok("Pomysł zaakceptowany jako wydarzenie");
    }


    @PostMapping("/{id}/vote")
    public ResponseEntity<?> vote(@PathVariable Long id, @RequestParam Long userId, @RequestParam boolean choice) {
        Idea idea = ideaRepository.findById(id).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();

        Vote v = voteRepository.findByIdeaIdAndUserId(id, userId)
                .orElse(new Vote(user, idea, choice));
        v.setChoice(choice);
        voteRepository.save(v);
        return ResponseEntity.ok("Zagłosowano");
    }
}