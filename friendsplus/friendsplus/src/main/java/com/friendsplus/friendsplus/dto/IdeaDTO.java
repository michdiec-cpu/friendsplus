package com.friendsplus.friendsplus.dto;

public class IdeaDTO {

    private Long id;
    private String title;
    private String description;
    private int rating;
    private Long groupId;
    private UserDTO author;

    public IdeaDTO(Long id,
                   String title,
                   String description,
                   int rating,
                   Long groupId,
                   UserDTO author) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.rating = rating;
        this.groupId = groupId;
        this.author = author;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public int getRating() { return rating; }
    public Long getGroupId() { return groupId; }
    public UserDTO getAuthor() { return author; }
}
