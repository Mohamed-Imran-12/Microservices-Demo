package com.example.analyticsservice.service;

import com.example.analyticsservice.dto.OrderAnalyticsDetails;
import com.example.analyticsservice.dto.ProductAnalyticsDetails;
import com.example.analyticsservice.model.DailySummary;
import com.example.analyticsservice.repository.DailySummaryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;


@Slf4j
@Service
@RequiredArgsConstructor
public class DailySummaryService {

    private final FallbackAnalyticsService fallbackAnalyticsService;
    private final DailySummaryRepository dailySummaryRepository;

    @Async
    @Transactional
    public void updateDailySummary(OrderAnalyticsDetails orderAnalyticsDetails)  {
        LocalDate date = orderAnalyticsDetails.getSoldAt().toLocalDate();
        Long totalItems = orderAnalyticsDetails.getItems()
                .stream()
                .mapToLong(ProductAnalyticsDetails::getQuantity)
                .sum();
        BigDecimal revenue = orderAnalyticsDetails.getItems()
                .stream()
                .map(ProductAnalyticsDetails::getRevenue)
                .reduce(BigDecimal.ZERO,BigDecimal::add);

        try {
            DailySummary dailySummary = dailySummaryRepository.findByDate(date).orElse(
                    DailySummary.builder()
                            .date(date)
                            .totalOrders(0L)
                            .totalItems(0L)
                            .revenue(BigDecimal.ZERO)
                            .build()
            );
            dailySummary.setTotalOrders(dailySummary.getTotalOrders()+1);
            dailySummary.setTotalItems(dailySummary.getTotalItems()+totalItems);
            dailySummary.setRevenue(dailySummary.getRevenue().add(revenue));
            dailySummaryRepository.save(dailySummary);
            log.info("Daily summary for order id {} updated successfully",orderAnalyticsDetails.getOrderId());
        } catch (DataIntegrityViolationException e) {
            fallbackAnalyticsService.retryUpdateDailySummary(date,totalItems,revenue);
        }
    }


    @Transactional
    public void restoreDailySummary(LocalDate date, Long totalItems, BigDecimal revenue) {
        DailySummary dailySummary = dailySummaryRepository.findByDate(date)
                .orElse(null);
        if (dailySummary==null){
            log.warn("Daily summary for date {} not exist",date);
            return;
        }
        dailySummary.setTotalOrders(dailySummary.getTotalOrders()-1);
        dailySummary.setTotalItems(dailySummary.getTotalItems()-totalItems);
        dailySummary.setRevenue(dailySummary.getRevenue().subtract(revenue));
        log.info("Daily summary restored successfully for cancelled order in date : {} ",date);
    }
}
