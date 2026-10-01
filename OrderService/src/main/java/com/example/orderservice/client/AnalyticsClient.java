package com.example.orderservice.client;

import com.example.orderservice.dto.OrderAnalyticsDetails;
import jakarta.validation.Valid;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient("analyticsservice")
public interface AnalyticsClient {

    @PostMapping("/analytics-service/analytics/add")
    void updateAnalytics(@Valid @RequestBody OrderAnalyticsDetails orderAnalyticsDetails);

    @DeleteMapping("/analytics-service/analytics/restore/{orderId}")
    void restoreAnalytics(@PathVariable Long orderId);
}
