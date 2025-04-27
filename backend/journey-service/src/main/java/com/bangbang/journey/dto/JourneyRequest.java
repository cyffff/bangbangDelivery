package com.bangbang.journey.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JourneyRequest {
    @NotBlank(message = "From country is required")
    private String fromCountry;

    @NotBlank(message = "From city is required")
    private String fromCity;

    @NotBlank(message = "To country is required")
    private String toCountry;

    @NotBlank(message = "To city is required")
    private String toCity;

    @NotNull(message = "Departure date is required")
    private LocalDate departureDate;

    @NotNull(message = "Arrival date is required")
    private LocalDate arrivalDate;

    @NotNull(message = "Available weight is required")
    @Min(value = 0, message = "Available weight must be positive")
    private Double availableWeight;

    @NotNull(message = "Available volume is required")
    @Min(value = 0, message = "Available volume must be positive")
    private Double availableVolume;

    private String notes;

    private Set<String> preferredItemTypes;
} 