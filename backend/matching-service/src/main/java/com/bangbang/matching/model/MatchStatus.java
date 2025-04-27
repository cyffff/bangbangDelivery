package com.bangbang.matching.model;

public enum MatchStatus {
    PROPOSED,    // Initial match suggestion
    PENDING,     // One party has confirmed
    CONFIRMED,   // Both parties have confirmed
    REJECTED,    // One or both parties rejected
    COMPLETED,   // The delivery was completed successfully
    CANCELLED    // The match was cancelled after confirmation
} 