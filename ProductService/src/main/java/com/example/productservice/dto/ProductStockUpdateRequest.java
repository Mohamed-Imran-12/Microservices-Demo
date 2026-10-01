package com.example.productservice.dto;

import com.example.productservice.model.StockTransactionType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductStockUpdateRequest {

    @NotNull(message = "Product id must not be null")
    @Positive(message = "Product id must be positive")
    private Long id;

    @NotNull(message = "Quantity must not be null")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;

    @NotNull(message = "Transaction type must not be null")
    private StockTransactionType type;
}
