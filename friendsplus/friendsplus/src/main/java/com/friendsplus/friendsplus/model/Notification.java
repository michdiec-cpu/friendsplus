package com.friendsplus.friendsplus.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String content;
    private String type;
    private Long relatedId;
    private boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Notification() {}

    public Notification(User user, String content, String type, Long relatedId) {
        this.user = user;
        this.content = content;
        this.type = type;
        this.relatedId = relatedId;
    }


    public Long getId() { return id; }
    public User getUser() { return user; }
    public String getContent() { return content; }
    public String getType() { return type; }
    public Long getRelatedId() { return relatedId; }
    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }
}