package com.friendsplus.friendsplus.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "group_requests")
public class GroupRequest {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"groups", "interests", "password", "verified"})
    private User user;

    @ManyToOne
    @JoinColumn(name = "group_id")
    @JsonIgnoreProperties({"members", "leader"})
    private Group group;

    public GroupRequest() {}
    public GroupRequest(User user, Group group) { this.user = user; this.group = group; }
    public Long getId() { return id; }
    public User getUser() { return user; }
    public Group getGroup() { return group; }
}