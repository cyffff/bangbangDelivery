package com.bangbang.matching.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "demand_id", nullable = false)
    private String demandId;

    @Column(name = "journey_id", nullable = false)
    private Long journeyId;

    @Column(name = "demand_user_id", nullable = false)
    private String demandUserId;

    @Column(name = "journey_user_id", nullable = false)
    private Long journeyUserId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private MatchStatus status;

    @Column(nullable = false)
    private Double matchScore;

    @Column(name = "demander_confirmed")
    private Boolean demanderConfirmed;

    @Column(name = "traveler_confirmed")
    private Boolean travelerConfirmed;

    @Column(name = "matched_at")
    @CreationTimestamp
    private LocalDateTime matchedAt;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
} 