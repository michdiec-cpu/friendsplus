package com.friendsplus.friendsplus.repository;

import com.friendsplus.friendsplus.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {
    List<Activity> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(String title);
    List<Activity> findTop10ByOrderByCreatedAtDesc();
}