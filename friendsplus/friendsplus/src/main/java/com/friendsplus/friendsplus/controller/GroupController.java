package com.friendsplus.friendsplus.controller;

import com.friendsplus.friendsplus.model.*;
import com.friendsplus.friendsplus.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "http://localhost:5173")
public class GroupController {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final GroupRequestRepository groupRequestRepository;
    private final NotificationRepository notificationRepository;
    private final PostRepository postRepository;

    public GroupController(GroupRepository groupRepository, UserRepository userRepository,
                           GroupRequestRepository groupRequestRepository,
                           NotificationRepository notificationRepository,
                           PostRepository postRepository) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.groupRequestRepository = groupRequestRepository;
        this.notificationRepository = notificationRepository;
        this.postRepository = postRepository;
    }


    @GetMapping
    public List<Map<String, Object>> getAllGroups() {
        return groupRepository.findAll().stream().map(g -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", g.getId());
            map.put("name", g.getName());
            map.put("description", g.getDescription());
            map.put("category", g.getCategory());
            map.put("memberCount", g.getMembers() != null ? g.getMembers().size() : 0);
            return map;
        }).collect(Collectors.toList());
    }


    @GetMapping("/user/{userId}")
    public List<Map<String, Object>> getGroupsByUser(@PathVariable Long userId) {
        return groupRepository.findGroupsByUserId(userId).stream().map(g -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", g.getId());
            map.put("name", g.getName());
            return map;
        }).collect(Collectors.toList());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getGroupById(@PathVariable Long id) {
        return groupRepository.findById(id).map(g -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", g.getId());
            map.put("name", g.getName());
            map.put("description", g.getDescription());
            map.put("category", g.getCategory());


            if (g.getLeader() != null) {
                Map<String, Object> leader = new HashMap<>();
                leader.put("id", g.getLeader().getId());
                leader.put("username", g.getLeader().getUsername());
                map.put("leader", leader);
            }


            List<Map<String, Object>> members = g.getMembers().stream().map(m -> {
                Map<String, Object> mObj = new HashMap<>();
                mObj.put("id", m.getId());
                mObj.put("username", m.getUsername());
                mObj.put("profilePhoto", m.getProfilePhoto()); // DODAJ TO
                return mObj;
            }).collect(Collectors.toList());
            map.put("members", members);

            return ResponseEntity.ok(map);
        }).orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("/{groupId}/posts")
    public List<Post> getPosts(@PathVariable Long groupId) {
        return postRepository.findByGroupIdOrderByCreatedAtDesc(groupId);
    }

    @PostMapping("/{groupId}/posts")
    public Post addPost(@PathVariable Long groupId, @RequestParam Long authorId, @RequestBody String content) {
        Group g = groupRepository.findById(groupId).orElseThrow();
        User u = userRepository.findById(authorId).orElseThrow();
        Post p = new Post();
        p.setGroup(g);
        p.setAuthor(u);
        p.setContent(content);
        return postRepository.save(p);
    }


    @GetMapping("/{groupId}/pending-requests")
    public List<Map<String, Object>> getPendingRequests(@PathVariable Long groupId) {
        return groupRequestRepository.findByGroupId(groupId).stream()
                .map(req -> {
                    Map<String, Object> uMap = new HashMap<>();
                    uMap.put("id", req.getUser().getId());
                    uMap.put("username", req.getUser().getUsername());
                    return uMap;
                })
                .collect(Collectors.toList());
    }

    @PostMapping("/{groupId}/request-join/{userId}")
    public ResponseEntity<?> requestJoin(@PathVariable Long groupId, @PathVariable Long userId) {
        Group g = groupRepository.findById(groupId).orElseThrow();
        User u = userRepository.findById(userId).orElseThrow();
        groupRequestRepository.save(new GroupRequest(u, g));
        return ResponseEntity.ok("Wysłano");
    }

    @PostMapping("/{groupId}/accept-user/{userId}")
    public ResponseEntity<?> acceptUser(@PathVariable Long groupId, @PathVariable Long userId) {
        Group g = groupRepository.findById(groupId).orElseThrow();
        User u = userRepository.findById(userId).orElseThrow();
        if(!g.getMembers().contains(u)) g.getMembers().add(u);
        groupRepository.save(g);
        groupRequestRepository.deleteByGroupIdAndUserId(groupId, userId);
        return ResponseEntity.ok("OK");
    }

    @PostMapping
    public Group createGroup(@RequestParam Long leaderId, @RequestBody Group group) {
        User leader = userRepository.findById(leaderId).orElseThrow();
        group.setLeader(leader);
        group.setMembers(new ArrayList<>(List.of(leader)));
        return groupRepository.save(group);
    }

    @GetMapping("/search")
    public List<Map<String, Object>> searchGroups(@RequestParam String q) {
        return groupRepository.searchGroups(q).stream().map(g -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", g.getId());
            map.put("name", g.getName());
            map.put("description", g.getDescription());
            map.put("category", g.getCategory());
            map.put("memberCount", g.getMembers().size());
            map.put("interests", g.getInterests().stream().map(Interest::getName).toList());
            return map;
        }).collect(Collectors.toList());
    }
}