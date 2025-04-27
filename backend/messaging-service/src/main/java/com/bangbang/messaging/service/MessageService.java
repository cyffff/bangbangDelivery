package com.bangbang.messaging.service;

import com.bangbang.messaging.dto.MessageDto;
import com.bangbang.messaging.dto.MessageRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MessageService {
    
    /**
     * Send a new message
     * 
     * @param messageRequest the message request
     * @return the created message
     */
    MessageDto sendMessage(MessageRequest messageRequest);
    
    /**
     * Get a message by ID
     * 
     * @param messageId the message ID
     * @return the message
     */
    MessageDto getMessage(Long messageId);
    
    /**
     * Get messages sent by a user
     * 
     * @param userId the user ID
     * @param pageable pagination info
     * @return page of messages
     */
    Page<MessageDto> getSentMessages(Long userId, Pageable pageable);
    
    /**
     * Get messages received by a user
     * 
     * @param userId the user ID
     * @param pageable pagination info
     * @return page of messages
     */
    Page<MessageDto> getReceivedMessages(Long userId, Pageable pageable);
    
    /**
     * Get conversation between two users
     * 
     * @param user1Id first user ID
     * @param user2Id second user ID
     * @param pageable pagination info
     * @return page of messages
     */
    Page<MessageDto> getConversation(Long user1Id, Long user2Id, Pageable pageable);
    
    /**
     * Get messages related to an order
     * 
     * @param orderId the order ID
     * @param pageable pagination info
     * @return page of messages
     */
    Page<MessageDto> getOrderMessages(Long orderId, Pageable pageable);
    
    /**
     * Get messages related to a demand
     * 
     * @param demandId the demand ID
     * @param pageable pagination info
     * @return page of messages
     */
    Page<MessageDto> getDemandMessages(Long demandId, Pageable pageable);
    
    /**
     * Get messages related to a journey
     * 
     * @param journeyId the journey ID
     * @param pageable pagination info
     * @return page of messages
     */
    Page<MessageDto> getJourneyMessages(Long journeyId, Pageable pageable);
    
    /**
     * Get archived messages for a user
     * 
     * @param userId the user ID
     * @param pageable pagination info
     * @return page of messages
     */
    Page<MessageDto> getArchivedMessages(Long userId, Pageable pageable);
    
    /**
     * Get unread messages for a user
     * 
     * @param userId the user ID
     * @return list of unread messages
     */
    List<MessageDto> getUnreadMessages(Long userId);
    
    /**
     * Count unread messages for a user
     * 
     * @param userId the user ID
     * @return count of unread messages
     */
    long countUnreadMessages(Long userId);
    
    /**
     * Mark a message as read
     * 
     * @param messageId the message ID
     * @param userId the user ID (must be the recipient)
     * @return true if successfully marked as read
     */
    boolean markAsRead(Long messageId, Long userId);
    
    /**
     * Mark a message as archived
     * 
     * @param messageId the message ID
     * @param userId the user ID
     * @return true if successfully marked as archived
     */
    boolean markAsArchived(Long messageId, Long userId);
    
    /**
     * Delete a message
     * 
     * @param messageId the message ID
     * @param userId the user ID
     * @return true if successfully deleted
     */
    boolean deleteMessage(Long messageId, Long userId);
} 