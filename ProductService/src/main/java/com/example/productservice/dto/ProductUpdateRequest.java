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
public class ProductUpdateRequest {

    @NotNull(message = "Product id must not be empty")
    @Positive(message = "Product id must be positive")
    private Long id;

    @NotBlank(message = "Product name must not be empty")
    private String name;

    @NotBlank(message = "Category must not be empty")
    private String category;

    @Positive(message = "Price must be positive value")
    @NotNull(message = "Price must not be empty")
    private BigDecimal price;

    @NotBlank(message = "Image URL must not be empty")
    private String imageUrl;

}
