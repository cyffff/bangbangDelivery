package com.bangbang.messaging.repository;

import com.bangbang.messaging.model.Message;
import com.bangbang.messaging.model.MessageStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    // Find messages sent by a user
    Page<Message> findBySenderIdAndStatusNotOrderByCreatedAtDesc(Long senderId, MessageStatus status, Pageable pageable);
    
    // Find messages received by a user
    Page<Message> findByReceiverIdAndStatusNotOrderByCreatedAtDesc(Long receiverId, MessageStatus status, Pageable pageable);
    
    // Find unread messages for a user
    List<Message> findByReceiverIdAndReadFalseAndStatusNot(Long receiverId, MessageStatus status);
    
    // Count unread messages for a user
    long countByReceiverIdAndReadFalseAndStatusNot(Long receiverId, MessageStatus status);
    
    // Find conversation between two users
    @Query("SELECT m FROM Message m WHERE ((m.senderId = ?1 AND m.receiverId = ?2) OR (m.senderId = ?2 AND m.receiverId = ?1)) AND m.status != ?3 ORDER BY m.createdAt DESC")
    Page<Message> findConversation(Long user1Id, Long user2Id, MessageStatus status, Pageable pageable);
    
    // Find messages related to an order
    Page<Message> findByRelatedOrderIdAndStatusNotOrderByCreatedAtDesc(Long orderId, MessageStatus status, Pageable pageable);
    
    // Find messages related to a demand
    Page<Message> findByRelatedDemandIdAndStatusNotOrderByCreatedAtDesc(Long demandId, MessageStatus status, Pageable pageable);
    
    // Find messages related to a journey
    Page<Message> findByRelatedJourneyIdAndStatusNotOrderByCreatedAtDesc(Long journeyId, MessageStatus status, Pageable pageable);
    
    // Find archived messages for a user
    @Query("SELECT m FROM Message m WHERE (m.senderId = ?1 OR m.receiverId = ?1) AND m.archived = true AND m.status != ?2 ORDER BY m.createdAt DESC")
    Page<Message> findArchivedMessages(Long userId, MessageStatus status, Pageable pageable);
    
    // Mark message as read
    @Modifying
    @Query("UPDATE Message m SET m.read = true WHERE m.id = ?1 AND m.receiverId = ?2")
    int markAsRead(Long messageId, Long receiverId);
    
    // Mark message as archived
    @Modifying
    @Query("UPDATE Message m SET m.archived = true WHERE m.id = ?1 AND (m.senderId = ?2 OR m.receiverId = ?2)")
    int markAsArchived(Long messageId, Long userId);
    
    // Mark message as deleted
    @Modifying
    @Query("UPDATE Message m SET m.status = ?1 WHERE m.id = ?2 AND (m.senderId = ?3 OR m.receiverId = ?3)")
    int markAsDeleted(MessageStatus status, Long messageId, Long userId);
} 