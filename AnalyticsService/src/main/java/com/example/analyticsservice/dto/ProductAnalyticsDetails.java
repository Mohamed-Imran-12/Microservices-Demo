package com.example.analyticsservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductAnalyticsDetails {

    @Positive(message = "Product id must be positive")
    @NotNull(message = "Product id must not be null")
    private Long productId;

    @NotBlank(message = "Product name must not be blank")
    private String productName;

    @NotBlank(message = "Category must not be blank")
    private String category;

    @Positive(message = "Quantity must be positive")
    @NotNull(message = "Quantity must not be null")
    private Integer quantity;

    @Positive(message = "Unit price must be positive")
    @NotNull(message = "Unit price must not be null")
    private BigDecimal unitPrice;

    @Positive(message = "Revenue must be positive")
    @NotNull(message = "Revenue must not be null")
    private BigDecimal revenue;
}