package com.friendsplus.friendsplus.controller;

import com.friendsplus.friendsplus.model.Event;
import com.friendsplus.friendsplus.model.Group;
import com.friendsplus.friendsplus.model.Notification;
import com.friendsplus.friendsplus.model.User;
import com.friendsplus.friendsplus.repository.EventRepository;
import com.friendsplus.friendsplus.repository.GroupRepository;
import com.friendsplus.friendsplus.repository.NotificationRepository;
import com.friendsplus.friendsplus.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173")
public class EventController {

    private final EventRepository eventRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;


    public EventController(EventRepository eventRepository,
                           GroupRepository groupRepository,
                           UserRepository userRepository,
                           NotificationRepository notificationRepository) {
        this.eventRepository = eventRepository;
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/group/{groupId}")
    public List<Event> getEventsByGroup(@PathVariable Long groupId) {
        return eventRepository.findByGroupId(groupId);
    }

    @PostMapping
    public Event createEvent(@RequestParam Long groupId, @RequestParam Long creatorId, @RequestBody Event event) {
        Group group = groupRepository.findById(groupId).orElseThrow();
        User creator = userRepository.findById(creatorId).orElseThrow();

        event.setGroup(group);
        event.setCreator(creator);

        if (event.getParticipants() == null) {
            event.setParticipants(new java.util.ArrayList<>());
        }
        event.getParticipants().add(creator);

        Event savedEvent = eventRepository.save(event);


        if (group.getMembers() != null) {
            for (User member : group.getMembers()) {
                if (!member.getId().equals(creatorId)) {
                    Notification n = new Notification(
                            member,
                            "Nowe wydarzenie w grupie " + group.getName() + ": " + event.getTitle(),
                            "EVENT_INVITE",
                            savedEvent.getId()
                    );
                    notificationRepository.save(n);
                }
            }
        }
        return savedEvent;
    }


    @PutMapping("/{id}")
    public Event updateEvent(@PathVariable Long id, @RequestBody Event details) {
        Event event = eventRepository.findById(id).orElseThrow();
        event.setTitle(details.getTitle());
        event.setLocation(details.getLocation());
        event.setEventDate(details.getEventDate());
        event.setStatus("POSTPONED");
        return eventRepository.save(event);
    }


    @PatchMapping("/{id}/cancel")
    public Event cancelEvent(@PathVariable Long id) {
        Event event = eventRepository.findById(id).orElseThrow();
        event.setStatus("CANCELED");
        return eventRepository.save(event);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        eventRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }


    @PostMapping("/{eventId}/join/{userId}")
    public Event joinEvent(@PathVariable Long eventId, @PathVariable Long userId) {
        Event event = eventRepository.findById(eventId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();
        if (!event.getParticipants().contains(user)) {
            event.getParticipants().add(user);
        }
        return eventRepository.save(event);
    }

    @GetMapping("/user/{userId}")
    public List<Event> getMyEvents(@PathVariable Long userId) {
        return eventRepository.findEventsByParticipantId(userId);
    }
}