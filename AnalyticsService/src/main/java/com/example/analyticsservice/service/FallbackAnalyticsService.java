package com.example.analyticsservice.service;

import com.example.analyticsservice.model.DailySummary;
import com.example.analyticsservice.repository.DailySummaryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@Slf4j
@RequiredArgsConstructor
public class FallbackAnalyticsService {

    private final DailySummaryRepository dailySummaryRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void retryUpdateDailySummary(LocalDate orderDate, long itemsCount, BigDecimal revenue) {
        for (int attempt = 1; attempt <= 3; attempt++) {
            DailySummary summary = dailySummaryRepository
                    .findByDate(orderDate)
                    .orElse(null);
            if (summary != null) {
                summary.setTotalOrders(summary.getTotalOrders() + 1);
                summary.setTotalItems(summary.getTotalItems() + itemsCount);
                summary.setRevenue(summary.getRevenue().add(revenue));
                dailySummaryRepository.save(summary);
                log.info("Daily summary updated successfully on retry attempt {}", attempt);
                return;
            }
            log.warn("Daily summary not found, retry attempt {}", attempt);
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return;
            }
        }
        log.error("Failed to update daily summary after retries");
    }
}