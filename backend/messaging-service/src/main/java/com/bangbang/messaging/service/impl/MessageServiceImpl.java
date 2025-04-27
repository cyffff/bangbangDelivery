package com.bangbang.messaging.service.impl;

import com.bangbang.messaging.dto.MessageDto;
import com.bangbang.messaging.dto.MessageRequest;
import com.bangbang.messaging.exception.MessageNotFoundException;
import com.bangbang.messaging.model.Message;
import com.bangbang.messaging.model.MessageStatus;
import com.bangbang.messaging.repository.MessageRepository;
import com.bangbang.messaging.service.MessageService;
import com.bangbang.messaging.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UserService userService;

    @Override
    @Transactional
    public MessageDto sendMessage(MessageRequest messageRequest) {
        Message message = Message.builder()
                .senderId(messageRequest.getSenderId())
                .receiverId(messageRequest.getReceiverId())
                .subject(messageRequest.getSubject())
                .content(messageRequest.getContent())
                .relatedOrderId(messageRequest.getRelatedOrderId())
                .relatedDemandId(messageRequest.getRelatedDemandId())
                .relatedJourneyId(messageRequest.getRelatedJourneyId())
                .parentMessageId(messageRequest.getParentMessageId())
                .status(MessageStatus.SENT)
                .read(false)
                .archived(false)
                .build();

        Message savedMessage = messageRepository.save(message);
        log.info("Message sent from user {} to user {}", message.getSenderId(), message.getReceiverId());
        
        return convertToDto(savedMessage);
    }

    @Override
    @Transactional(readOnly = true)
    public MessageDto getMessage(Long messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new MessageNotFoundException("Message not found with ID: " + messageId));
        
        return convertToDto(message);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MessageDto> getSentMessages(Long userId, Pageable pageable) {
        Page<Message> messages = messageRepository.findBySenderIdAndStatusNotOrderByCreatedAtDesc(
                userId, MessageStatus.DELETED, pageable);
        
        return messages.map(this::convertToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MessageDto> getReceivedMessages(Long userId, Pageable pageable) {
        Page<Message> messages = messageRepository.findByReceiverIdAndStatusNotOrderByCreatedAtDesc(
                userId, MessageStatus.DELETED, pageable);
        
        return messages.map(this::convertToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MessageDto> getConversation(Long user1Id, Long user2Id, Pageable pageable) {
        Page<Message> messages = messageRepository.findConversation(
                user1Id, user2Id, MessageStatus.DELETED, pageable);
        
        return messages.map(this::convertToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MessageDto> getOrderMessages(Long orderId, Pageable pageable) {
        Page<Message> messages = messageRepository.findByRelatedOrderIdAndStatusNotOrderByCreatedAtDesc(
                orderId, MessageStatus.DELETED, pageable);
        
        return messages.map(this::convertToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MessageDto> getDemandMessages(Long demandId, Pageable pageable) {
        Page<Message> messages = messageRepository.findByRelatedDemandIdAndStatusNotOrderByCreatedAtDesc(
                demandId, MessageStatus.DELETED, pageable);
        
        return messages.map(this::convertToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MessageDto> getJourneyMessages(Long journeyId, Pageable pageable) {
        Page<Message> messages = messageRepository.findByRelatedJourneyIdAndStatusNotOrderByCreatedAtDesc(
                journeyId, MessageStatus.DELETED, pageable);
        
        return messages.map(this::convertToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MessageDto> getArchivedMessages(Long userId, Pageable pageable) {
        Page<Message> messages = messageRepository.findArchivedMessages(
                userId, MessageStatus.DELETED, pageable);
        
        return messages.map(this::convertToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageDto> getUnreadMessages(Long userId) {
        List<Message> messages = messageRepository.findByReceiverIdAndReadFalseAndStatusNot(
                userId, MessageStatus.DELETED);
        
        return messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long countUnreadMessages(Long userId) {
        return messageRepository.countByReceiverIdAndReadFalseAndStatusNot(
                userId, MessageStatus.DELETED);
    }

    @Override
    @Transactional
    public boolean markAsRead(Long messageId, Long userId) {
        int result = messageRepository.markAsRead(messageId, userId);
        
        if (result > 0) {
            log.info("Message {} marked as read by user {}", messageId, userId);
            return true;
        }
        
        return false;
    }

    @Override
    @Transactional
    public boolean markAsArchived(Long messageId, Long userId) {
        int result = messageRepository.markAsArchived(messageId, userId);
        
        if (result > 0) {
            log.info("Message {} archived by user {}", messageId, userId);
            return true;
        }
        
        return false;
    }

    @Override
    @Transactional
    public boolean deleteMessage(Long messageId, Long userId) {
        int result = messageRepository.markAsDeleted(MessageStatus.DELETED, messageId, userId);
        
        if (result > 0) {
            log.info("Message {} deleted by user {}", messageId, userId);
            return true;
        }
        
        return false;
    }
    
    /**
     * Convert Message entity to MessageDto
     */
    private MessageDto convertToDto(Message message) {
        String senderName = userService.getUsernameById(message.getSenderId());
        String receiverName = userService.getUsernameById(message.getReceiverId());
        
        return MessageDto.builder()
                .id(message.getId())
                .senderId(message.getSenderId())
                .senderName(senderName)
                .receiverId(message.getReceiverId())
                .receiverName(receiverName)
                .subject(message.getSubject())
                .content(message.getContent())
                .relatedOrderId(message.getRelatedOrderId())
                .relatedDemandId(message.getRelatedDemandId())
                .relatedJourneyId(message.getRelatedJourneyId())
                .status(message.getStatus())
                .read(message.isRead())
                .archived(message.isArchived())
                .parentMessageId(message.getParentMessageId())
                .createdAt(message.getCreatedAt())
                .updatedAt(message.getUpdatedAt())
                .build();
    }
} 