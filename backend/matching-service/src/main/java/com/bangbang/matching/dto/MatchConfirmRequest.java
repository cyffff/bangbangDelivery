package com.bangbang.matching.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchConfirmRequest {
    @NotNull(message = "Confirmation status is required")
    private Boolean confirmed;
} 