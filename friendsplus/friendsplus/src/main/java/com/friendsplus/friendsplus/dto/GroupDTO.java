package com.friendsplus.friendsplus.dto;

import java.util.List;

public class GroupDTO {

    private Long id;
    private String name;
    private String description;
    private UserDTO leader;
    private List<UserDTO> members;

    public GroupDTO(Long id, String name, String description,
                    UserDTO leader, List<UserDTO> members) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.leader = leader;
        this.members = members;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public UserDTO getLeader() { return leader; }
    public List<UserDTO> getMembers() { return members; }
}
