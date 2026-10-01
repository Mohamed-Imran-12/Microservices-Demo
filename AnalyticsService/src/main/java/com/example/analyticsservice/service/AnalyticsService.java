package com.example.analyticsservice.service;

import com.example.analyticsservice.dto.*;
import com.example.analyticsservice.exception.InvalidTimeRangeException;
import com.example.analyticsservice.exception.ProductNotFoundException;
import com.example.analyticsservice.exception.SalesAnalyticsException;
import com.example.analyticsservice.exception.UserNotFoundException;
import com.example.analyticsservice.model.SalesRecord;
import com.example.analyticsservice.repository.DailySummaryRepository;
import com.example.analyticsservice.repository.SalesRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AnalyticsService {

    private final DailySummaryService dailySummaryService;
    private final SalesRecordRepository salesRecordRepository;
    private final DailySummaryRepository dailySummaryRepository;


    public void updateAnalytics(OrderAnalyticsDetails orderAnalyticsDetails) {
        if (salesRecordRepository.existsByOrderId(orderAnalyticsDetails.getOrderId())) {
            log.warn("Order id {} already exists", orderAnalyticsDetails.getOrderId());
            return;
        }
        for (ProductAnalyticsDetails productAnalyticsDetails : orderAnalyticsDetails.getItems()) {
            salesRecordRepository.save(
                    SalesRecord.builder()
                            .orderId(orderAnalyticsDetails.getOrderId())
                            .userId(orderAnalyticsDetails.getUserId())
                            .productId(productAnalyticsDetails.getProductId())
                            .productName(productAnalyticsDetails.getProductName())
                            .Category(productAnalyticsDetails.getCategory())
                            .quantity(productAnalyticsDetails.getQuantity())
                            .unitPrice(productAnalyticsDetails.getUnitPrice())
                            .revenue(productAnalyticsDetails.getRevenue())
                            .soldAt(orderAnalyticsDetails.getSoldAt())
                            .build()
            );
        }
        dailySummaryService.updateDailySummary(orderAnalyticsDetails);
        log.info("Analytics for order id {} updated successfully", orderAnalyticsDetails.getOrderId());
    }

    @Transactional
    public void restoreAnalytics(Long orderId) {
        List<SalesRecord> salesRecords = salesRecordRepository.findAllByOrderId(orderId);
        if (salesRecords.isEmpty()) {
            log.warn("Sales record for order id {} not exist", orderId);
            return;
        }
        LocalDate date = salesRecords.getFirst().getSoldAt().toLocalDate();
        Long totalItems = salesRecords.stream()
                .mapToLong(SalesRecord::getQuantity)
                .sum();
        BigDecimal revenue = salesRecords.stream()
                .map(SalesRecord::getRevenue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dailySummaryService.restoreDailySummary(date, totalItems, revenue);
        salesRecordRepository.deleteAllByOrderId(orderId);
        log.info("Sales record for order id {} restored successfully", orderId);
    }

    public DashboardData getDashboardAnalytics() {
        return dailySummaryRepository.findDashboardSummary();
    }

    public List<SalesTrendData> getSalesTrendData(LocalDate from, LocalDate to) {
        if (from.isAfter(to) || to.isAfter(LocalDate.now())) {
            throw new InvalidTimeRangeException("Time range from " + from + " to " + to + " is invalid");
        }
        return dailySummaryRepository.findSalesTrendByRange(from, to);
    }

    public List<ProductSalesData> getTopProducts(Integer limit) {
        limit = Math.max(1, limit);
        return salesRecordRepository.findMostSoldProducts(limit);
    }

    public List<SalesDataByCategory> getSalesDataByCategory() {
        return salesRecordRepository.findSalesDataByCategory();
    }

    public ProductSalesData getProductSalesData(Long productId) {
        return salesRecordRepository
                .findProductSalesDataByProductId(productId)
                .orElseThrow(() ->
                        new ProductNotFoundException(
                                "Product id " + productId + " not exist"
                        )
                );
    }

    public SalesDataByUser getUserSalesData(Long userId) {
        return salesRecordRepository.findSalesDataByUserId(userId)
                .orElseThrow(() ->
                        new UserNotFoundException("User id " + userId + " not exist")
                );
    }

    public ProductSalesByRangeData getProductSalesDataByRange(Long productId, LocalDate from, LocalDate to) {
        if (from.isAfter(to) || to.isAfter(LocalDate.now())) {
            throw new InvalidTimeRangeException("Time range from " + from + " to " + to + " is invalid");
        }
        ProductSalesByRange productSalesByRange = salesRecordRepository
                .findProductSalesDataByRange(productId, from.atStartOfDay(), to.atTime(LocalTime.MAX))
                .orElseThrow(() ->
                        new SalesAnalyticsException(
                                "Product id " + productId +
                                " does not exist or no sales data is available for the given time range")
                );
        return ProductSalesByRangeData.builder()
                .productId(productId)
                .productName(productSalesByRange.getProductName())
                .category(productSalesByRange.getCategory())
                .quantitySold(productSalesByRange.getQuantitySold())
                .revenue(productSalesByRange.getRevenue())
                .from(from)
                .to(to)
                .build();
    }

    public RevenueByRangeData getRevenueByRange(LocalDate from, LocalDate to) {
        if (from.isAfter(to) || to.isAfter(LocalDate.now())) {
            throw new InvalidTimeRangeException("Time range from " + from + " to " + to + " is invalid");
        }

        RevenueByRange revenueByRange = dailySummaryRepository.findRevenueByRange(from,to);

        return RevenueByRangeData.builder()
                .totalRevenue(revenueByRange.getTotalRevenue())
                .totalOrders(revenueByRange.getTotalOrders())
                .totalItems(revenueByRange.getTotalItems())
                .averageOrderValue(revenueByRange.getAverageOrderValue())
                .from(from)
                .to(to)
                .build();
    }
}
