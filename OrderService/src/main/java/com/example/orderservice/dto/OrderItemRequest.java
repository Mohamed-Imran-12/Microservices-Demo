package com.example.orderservice.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemRequest {

    @Positive(message = "Product id must be positive")
    @NotNull(message = "Product id must not be empty")
    private Long productId;

    @Positive(message = "Quantity must be positive")
    @NotNull(message = "Quantity must not be empty")
    private Integer quantity;

}
