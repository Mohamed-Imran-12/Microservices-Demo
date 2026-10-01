package com.example.analyticsservice.controller;

import com.example.analyticsservice.dto.*;
import com.example.analyticsservice.service.AnalyticsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/analytics-service")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @PostMapping("/analytics/add")
    public void updateAnalytics(@Valid @RequestBody OrderAnalyticsDetails orderAnalyticsDetails){
        analyticsService.updateAnalytics(orderAnalyticsDetails);
    }

    @DeleteMapping("/analytics/restore/{orderId}")
    public void restoreAnalytics(@PathVariable Long orderId){
        analyticsService.restoreAnalytics(orderId);
    }

    @GetMapping("/analytics/dashboard")
    public ResponseEntity<DashboardData> getDashboardAnalytics(){
        DashboardData body = analyticsService.getDashboardAnalytics();
        return ResponseEntity.ok(body);
    }

    @GetMapping("/analytics/sales/trend")
    public ResponseEntity<List<SalesTrendData>> getSalesTrend(@RequestParam LocalDate from, @RequestParam LocalDate to){
        List<SalesTrendData> body = analyticsService.getSalesTrendData(from,to);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/analytics/products/top")
    public ResponseEntity<List<ProductSalesData>> getTopProducts(@RequestParam(defaultValue = "10") Integer limit){
        List<ProductSalesData> body = analyticsService.getTopProducts(limit);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/analytics/categories")
    public ResponseEntity<List<SalesDataByCategory>> getSalesDataByCategory(){
        List<SalesDataByCategory> body = analyticsService.getSalesDataByCategory();
        return ResponseEntity.ok(body);
    }

    @GetMapping("/analytics/product/{productId}")
    public ResponseEntity<ProductSalesData> getProductSalesData(@PathVariable Long productId){
        ProductSalesData body = analyticsService.getProductSalesData(productId);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/analytics/user/{userId}")
    public ResponseEntity<SalesDataByUser> getUserSalesData(@PathVariable Long userId){
        SalesDataByUser body = analyticsService.getUserSalesData(userId);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/analytics/product/{productId}/sales")
    public ResponseEntity<ProductSalesByRangeData> getProductSalesDataByRange(@PathVariable Long productId,@RequestParam LocalDate from,@RequestParam LocalDate to){
        ProductSalesByRangeData body = analyticsService.getProductSalesDataByRange(productId,from,to);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/analytics/revenue")
    public ResponseEntity<RevenueByRangeData> getRevenueByRange(@RequestParam LocalDate from, @RequestParam LocalDate to){
        RevenueByRangeData body = analyticsService.getRevenueByRange(from,to);
        return ResponseEntity.ok(body);
    }
}
