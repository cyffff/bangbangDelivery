package com.bangbang.messaging.dto;

import com.bangbang.messaging.model.MessageStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    private Long id;
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private String receiverName;
    private String subject;
    private String content;
    private Long relatedOrderId;
    private Long relatedDemandId;
    private Long relatedJourneyId;
    private MessageStatus status;
    private boolean read;
    private boolean archived;
    private Long parentMessageId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 