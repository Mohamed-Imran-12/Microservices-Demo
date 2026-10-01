package com.example.analyticsservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductSalesByRangeData {
    private Long productId;
    private String productName;
    private String category;
    private Long quantitySold;
    private BigDecimal revenue;
    private LocalDate from;
    private LocalDate to;
}
