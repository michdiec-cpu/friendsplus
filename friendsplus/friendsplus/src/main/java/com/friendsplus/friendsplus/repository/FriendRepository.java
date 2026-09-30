package com.friendsplus.friendsplus.repository;

import com.friendsplus.friendsplus.model.Friendship;
import com.friendsplus.friendsplus.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface FriendRepository extends JpaRepository<Friendship, Long> {
    List<Friendship> findByFriendAndStatus(User friend, String status);

    @Query("SELECT f FROM Friendship f WHERE f.status = 'accepted' AND (f.user.id = :id OR f.friend.id = :id)")
    List<Friendship> findAcceptedFriends(@Param("id") Long id);

    boolean existsByUserAndFriend(User user, User friend);

    @Query("SELECT f FROM Friendship f WHERE (f.user.id = :u1 AND f.friend.id = :u2) OR (f.user.id = :u2 AND f.friend.id = :u1)")
    Optional<Friendship> findRelation(@Param("u1") Long u1, @Param("u2") Long u2);
}