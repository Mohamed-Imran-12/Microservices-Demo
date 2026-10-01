package com.example.productservice.dto;

import com.example.productservice.model.StockTransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductTransactionResponse {

    private Long id;
    private Long productId;
    private StockTransactionType type;
    private Integer quantity;
    private LocalDateTime createdAt;

}
