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
public class DashboardData {

    private Long totalOrders;
    private Long totalItems;
    private BigDecimal totalRevenue;
    private BigDecimal averageOrderValue;
}
