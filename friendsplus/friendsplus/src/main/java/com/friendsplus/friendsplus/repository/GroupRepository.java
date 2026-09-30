package com.friendsplus.friendsplus.repository;

import com.friendsplus.friendsplus.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Long> {

    @Query("SELECT DISTINCT g FROM Group g JOIN g.members m WHERE m.id = :userId")
    List<Group> findGroupsByUserId(@Param("userId") Long userId);

    @Query("SELECT DISTINCT g FROM Group g LEFT JOIN g.interests i WHERE " +
            "g.name LIKE %:q% OR g.description LIKE %:q% OR g.category LIKE %:q% OR i.name LIKE %:q%")
    List<Group> searchGroups(@Param("q") String q);
}