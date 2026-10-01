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
public class RevenueByRange {
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long totalItems;
    private BigDecimal averageOrderValue;
}
