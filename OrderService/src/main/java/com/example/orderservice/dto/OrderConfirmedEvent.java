package com.example.orderservice.dto;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Builder
public record OrderConfirmedEvent(
        Long orderId,
        Long userId,
        LocalDateTime createdAt,
        List<OrderItemResponse> orderItemResponses,
        Map<Long, ProductResponse> productResponseMap
) {}
