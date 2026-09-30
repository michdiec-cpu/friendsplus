package com.friendsplus.friendsplus.dto;

public class UserDTO {

    private Long id;
    private String username;
    private String email;
    private String location;
    private String ageGroup;

    public UserDTO(Long id, String username, String email,
                   String location, String ageGroup) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.location = location;
        this.ageGroup = ageGroup;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public String getLocation() { return location; }
    public String getAgeGroup() { return ageGroup; }
}
