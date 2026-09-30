package com.friendsplus.friendsplus.repository;

import com.friendsplus.friendsplus.model.Idea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface IdeaRepository extends JpaRepository<Idea, Long> {

    List<Idea> findByGroupIdOrderByIdDesc(Long groupId);

    @Query("SELECT i FROM Idea i LEFT JOIN i.votes v WHERE i.group.id = :groupId GROUP BY i ORDER BY COUNT(v) DESC")
    List<Idea> findTopIdeasByGroup(@Param("groupId") Long groupId);
}