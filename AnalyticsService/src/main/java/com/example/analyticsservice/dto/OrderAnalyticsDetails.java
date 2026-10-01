package com.example.analyticsservice.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderAnalyticsDetails {

    @Positive(message = "Order id must be positive")
    @NotNull(message = "Order id must not be null")
    private Long orderId;

    @Positive(message = "User id must be positive")
    @NotNull(message = "User id must not be null")
    private Long userId;

    @NotNull(message = "Sold time must not be null")
    private LocalDateTime soldAt;

    @Valid
    @NotEmpty(message = "Order must contain at least one item")
    private List<ProductAnalyticsDetails> items;
}
