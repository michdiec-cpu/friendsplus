package com.friendsplus.friendsplus.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.*;

@Entity
@Table(name = "groups")
public class Group {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String category;

    @ManyToOne
    @JoinColumn(name = "leader_id")
    @JsonIgnoreProperties({"groups", "interests", "password", "verified"})
    private User leader;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "group_members", joinColumns = @JoinColumn(name = "group_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    @JsonIgnoreProperties({"groups", "interests", "password", "verified"})
    private List<User> members = new ArrayList<>();


    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "group_interests", joinColumns = @JoinColumn(name = "group_id"), inverseJoinColumns = @JoinColumn(name = "interest_id"))
    @JsonIgnoreProperties("groups")
    private Set<Interest> interests = new HashSet<>();

    public Group() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public User getLeader() { return leader; }
    public void setLeader(User leader) { this.leader = leader; }
    public List<User> getMembers() { return members; }
    public void setMembers(List<User> members) { this.members = members; }
    public Set<Interest> getInterests() { return interests; }
    public void setInterests(Set<Interest> interests) { this.interests = interests; }
}