package com.friendsplus.friendsplus.dto;

public class IdeaRatingDTO {

    private Long ideaId;
    private double averageRating;
    private long votesCount;

    public IdeaRatingDTO(Long ideaId, double averageRating, long votesCount) {
        this.ideaId = ideaId;
        this.averageRating = averageRating;
        this.votesCount = votesCount;
    }

    public Long getIdeaId() {
        return ideaId;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public long getVotesCount() {
        return votesCount;
    }
}
