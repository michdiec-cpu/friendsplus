package com.friendsplus.friendsplus.repository;

import com.friendsplus.friendsplus.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT DISTINCT u FROM User u " +
            "LEFT JOIN u.interests i " +
            "WHERE (u.username LIKE %:q% OR u.location LIKE %:q% OR i.name LIKE %:q%) " +
            "AND u.id != :currentUserId " +
            "AND u.id NOT IN (SELECT f.friend.id FROM Friendship f WHERE f.user.id = :currentUserId AND f.status = 'blocked') " +
            "AND u.id NOT IN (SELECT f.user.id FROM Friendship f WHERE f.friend.id = :currentUserId AND f.status = 'blocked')")
    List<User> searchUsers(@Param("q") String q, @Param("currentUserId") Long currentUserId);
}