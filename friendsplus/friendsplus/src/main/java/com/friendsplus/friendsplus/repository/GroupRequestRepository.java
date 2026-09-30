package com.friendsplus.friendsplus.repository;

import com.friendsplus.friendsplus.model.GroupRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface GroupRequestRepository extends JpaRepository<GroupRequest, Long> {
    List<GroupRequest> findByGroupId(Long groupId);

    @Transactional
    void deleteByGroupIdAndUserId(Long groupId, Long userId);
}