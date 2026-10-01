package com.example.orderservice.dto;

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

    private Long productId;
    private String productName;
    private String category;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal revenue;

}
