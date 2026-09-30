package com.friendsplus.friendsplus.repository;

import com.friendsplus.friendsplus.model.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByIdeaIdAndUserId(Long ideaId, Long userId);
}