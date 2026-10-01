package com.example.productservice.dto;

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
public class ProductRequest {

    @NotBlank(message = "Product name must not be empty")
    private String name;

    @NotBlank(message = "Category must not be empty")
    private String category;

    @Positive(message = "Price must be positive value")
    @NotNull(message = "Price must not be empty")
    private BigDecimal price;

    @Positive(message = "Stock must be positive value")
    @NotNull(message = "Stock must not be empty")
    private Integer stock;

    @NotBlank(message = "Image URL must not be empty")
    private String imageUrl;
}
