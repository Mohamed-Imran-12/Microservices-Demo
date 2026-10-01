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
public class ProductDetails {

    @NotNull(message = "Product id must not be empty")
    @Positive(message = "Product id must be positive")
    private Long productId;

    @NotNull(message = "Quantity must not be empty")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;

}
