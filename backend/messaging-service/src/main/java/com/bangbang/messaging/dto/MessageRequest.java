package com.bangbang.messaging.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequest {
    @NotNull(message = "Sender ID is required")
    private Long senderId;
    
    @NotNull(message = "Receiver ID is required")
    private Long receiverId;
    
    @NotBlank(message = "Subject cannot be blank")
    private String subject;
    
    @NotBlank(message = "Content cannot be blank")
    private String content;
    
    private Long relatedOrderId;
    private Long relatedDemandId;
    private Long relatedJourneyId;
    private Long parentMessageId;
} 