package com.friendsplus.friendsplus.model;

import jakarta.persistence.*;

@Entity
@Table(name = "votes")
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "idea_id", nullable = false)
    private Idea idea;

    private boolean choice;


    public Vote() {}

    public Vote(User user, Idea idea, boolean choice) {
        this.user = user;
        this.idea = idea;
        this.choice = choice;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Idea getIdea() { return idea; }
    public void setIdea(Idea idea) { this.idea = idea; }
    public boolean isChoice() { return choice; }
    public void setChoice(boolean choice) { this.choice = choice; }
}