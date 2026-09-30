package com.friendsplus.friendsplus.repository;

import com.friendsplus.friendsplus.model.Interest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface InterestRepository extends JpaRepository<Interest, Long> {

    @Query("SELECT i, COUNT(u) FROM Interest i LEFT JOIN i.users u " +
            "WHERE i.name LIKE %:q% " +
            "GROUP BY i " +
            "ORDER BY COUNT(u) DESC")
    List<Object[]> searchWithPopularity(@Param("q") String q);

    Optional<Interest> findByNameIgnoreCase(String name);

    List<Interest> findAllByIdIn(List<Long> ids);

    @Query("SELECT i FROM Interest i LEFT JOIN i.users u GROUP BY i ORDER BY COUNT(u) DESC")
    List<Interest> findPopular(org.springframework.data.domain.Pageable pageable);
}