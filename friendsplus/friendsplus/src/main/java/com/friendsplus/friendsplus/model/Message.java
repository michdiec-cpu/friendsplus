package com.friendsplus.friendsplus.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = true) // nullable, bo wiadomość może być grupowa
    private User receiver;

    // --- TO DODAJEMY ---
    @ManyToOne
    @JoinColumn(name = "group_id", nullable = true) // nullable, bo wiadomość może być prywatna
    private Group group;

    @Column(columnDefinition = "TEXT")
    private String content;

    private LocalDateTime sentAt = LocalDateTime.now();

    public Message() {}


    public Long getId() { return id; }
    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }
    public User getReceiver() { return receiver; }
    public void setReceiver(User receiver) { this.receiver = receiver; }


    public Group getGroup() { return group; }
    public void setGroup(Group group) { this.group = group; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getSentAt() { return sentAt; }
}