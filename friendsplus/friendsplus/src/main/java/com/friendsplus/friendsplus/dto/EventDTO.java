package com.friendsplus.friendsplus.dto;

import java.time.LocalDateTime;
import java.util.List;

public class EventDTO {

    private Long id;
    private String title;
    private String description;
    private String location;
    private LocalDateTime eventDate;
    private Long groupId;
    private List<UserDTO> participants;

    public EventDTO(Long id,
                    String title,
                    String description,
                    String location,
                    LocalDateTime eventDate,
                    Long groupId,
                    List<UserDTO> participants) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.location = location;
        this.eventDate = eventDate;
        this.groupId = groupId;
        this.participants = participants;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getLocation() { return location; }
    public LocalDateTime getEventDate() { return eventDate; }
    public Long getGroupId() { return groupId; }
    public List<UserDTO> getParticipants() { return participants; }
}
