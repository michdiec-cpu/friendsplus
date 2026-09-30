package com.friendsplus.friendsplus.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ideas")
public class Idea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String location; // NOWE
    private LocalDateTime proposedDate; // NOWE


    private String status = "PROPOSED";
    private LocalDateTime votingDeadline;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private User author;

    @ManyToOne
    @JoinColumn(name = "group_id")
    private Group group;

    @OneToMany(mappedBy = "idea", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Vote> votes = new ArrayList<>();

    public Idea() {}


    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public LocalDateTime getProposedDate() { return proposedDate; }
    public void setProposedDate(LocalDateTime proposedDate) { this.proposedDate = proposedDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getVotingDeadline() { return votingDeadline; }
    public void setVotingDeadline(LocalDateTime votingDeadline) { this.votingDeadline = votingDeadline; }
    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
    public Group getGroup() { return group; }
    public void setGroup(Group group) { this.group = group; }
    public List<Vote> getVotes() { return votes; }
    public void setVotes(List<Vote> votes) { this.votes = votes; }
}