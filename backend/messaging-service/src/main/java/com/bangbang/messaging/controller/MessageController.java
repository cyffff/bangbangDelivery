package com.bangbang.messaging.controller;

import com.bangbang.messaging.dto.MessageDto;
import com.bangbang.messaging.dto.MessageRequest;
import com.bangbang.messaging.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Slf4j
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<MessageDto> sendMessage(@Valid @RequestBody MessageRequest messageRequest) {
        log.info("Sending message from user {} to user {}", messageRequest.getSenderId(), messageRequest.getReceiverId());
        MessageDto messageDto = messageService.sendMessage(messageRequest);
        return new ResponseEntity<>(messageDto, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MessageDto> getMessage(@PathVariable Long id) {
        log.info("Fetching message with ID: {}", id);
        MessageDto messageDto = messageService.getMessage(id);
        return ResponseEntity.ok(messageDto);
    }

    @GetMapping("/sent/{userId}")
    public ResponseEntity<Page<MessageDto>> getSentMessages(
            @PathVariable Long userId,
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("Fetching sent messages for user ID: {}", userId);
        Page<MessageDto> messages = messageService.getSentMessages(userId, pageable);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/received/{userId}")
    public ResponseEntity<Page<MessageDto>> getReceivedMessages(
            @PathVariable Long userId,
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("Fetching received messages for user ID: {}", userId);
        Page<MessageDto> messages = messageService.getReceivedMessages(userId, pageable);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/conversation")
    public ResponseEntity<Page<MessageDto>> getConversation(
            @RequestParam Long user1Id,
            @RequestParam Long user2Id,
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("Fetching conversation between users {} and {}", user1Id, user2Id);
        Page<MessageDto> messages = messageService.getConversation(user1Id, user2Id, pageable);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Page<MessageDto>> getOrderMessages(
            @PathVariable Long orderId,
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("Fetching messages for order ID: {}", orderId);
        Page<MessageDto> messages = messageService.getOrderMessages(orderId, pageable);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/demand/{demandId}")
    public ResponseEntity<Page<MessageDto>> getDemandMessages(
            @PathVariable Long demandId,
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("Fetching messages for demand ID: {}", demandId);
        Page<MessageDto> messages = messageService.getDemandMessages(demandId, pageable);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/journey/{journeyId}")
    public ResponseEntity<Page<MessageDto>> getJourneyMessages(
            @PathVariable Long journeyId,
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("Fetching messages for journey ID: {}", journeyId);
        Page<MessageDto> messages = messageService.getJourneyMessages(journeyId, pageable);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/archived/{userId}")
    public ResponseEntity<Page<MessageDto>> getArchivedMessages(
            @PathVariable Long userId,
            @PageableDefault(size = 20) Pageable pageable) {
        log.info("Fetching archived messages for user ID: {}", userId);
        Page<MessageDto> messages = messageService.getArchivedMessages(userId, pageable);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/unread/{userId}")
    public ResponseEntity<List<MessageDto>> getUnreadMessages(@PathVariable Long userId) {
        log.info("Fetching unread messages for user ID: {}", userId);
        List<MessageDto> messages = messageService.getUnreadMessages(userId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/unread/count/{userId}")
    public ResponseEntity<Long> countUnreadMessages(@PathVariable Long userId) {
        log.info("Counting unread messages for user ID: {}", userId);
        long count = messageService.countUnreadMessages(userId);
        return ResponseEntity.ok(count);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id,
            @RequestParam Long userId) {
        log.info("Marking message {} as read by user {}", id, userId);
        boolean success = messageService.markAsRead(id, userId);
        
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}/archive")
    public ResponseEntity<Void> markAsArchived(
            @PathVariable Long id,
            @RequestParam Long userId) {
        log.info("Archiving message {} by user {}", id, userId);
        boolean success = messageService.markAsArchived(id, userId);
        
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMessage(
            @PathVariable Long id,
            @RequestParam Long userId) {
        log.info("Deleting message {} by user {}", id, userId);
        boolean success = messageService.deleteMessage(id, userId);
        
        if (success) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.badRequest().build();
        }
    }
} 