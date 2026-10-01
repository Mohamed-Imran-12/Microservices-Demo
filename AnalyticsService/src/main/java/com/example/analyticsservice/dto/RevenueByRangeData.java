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
public class RevenueByRangeData {
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long totalItems;
    private BigDecimal averageOrderValue;
    private LocalDate from;
    private LocalDate to;
}
