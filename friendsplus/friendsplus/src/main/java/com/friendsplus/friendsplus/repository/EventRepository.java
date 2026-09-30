package com.friendsplus.friendsplus.repository;

import com.friendsplus.friendsplus.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByGroupId(Long groupId);
    @Query("""
    SELECT DISTINCT e
    FROM Event e
    LEFT JOIN FETCH e.participants
    WHERE e.group.id = :groupId
""")
    List<Event> findByGroupIdWithParticipants(Long groupId);
    Page<Event> findByGroupId(Long groupId, Pageable pageable);
    @Query("SELECT e FROM Event e JOIN e.participants p WHERE p.id = :userId AND e.status = 'ACTIVE'")
    List<Event> findEventsByParticipantId(@Param("userId") Long userId);
    List<Event> findByLocationContainingIgnoreCaseAndStatus(String location, String status);
}
