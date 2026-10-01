package com.example.analyticsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductSalesByRange {
    private Long productId;
    private String productName;
    private String category;
    private Long quantitySold;
    private BigDecimal revenue;
}
