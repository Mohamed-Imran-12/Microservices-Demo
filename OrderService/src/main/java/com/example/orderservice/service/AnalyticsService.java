package com.example.orderservice.service;

import com.example.orderservice.client.AnalyticsClient;
import com.example.orderservice.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final AnalyticsClient analyticsClient;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void sendOrderAnalytics(OrderConfirmedEvent orderConfirmedEvent) {
        List<ProductAnalyticsDetails> items = new ArrayList<>();
        for (OrderItemResponse orderItemResponse : orderConfirmedEvent.orderItemResponses()) {
            items.add(ProductAnalyticsDetails.builder()
                    .productId(orderItemResponse.getProductId())
                    .productName(orderItemResponse.getProductName())
                    .category(orderConfirmedEvent.productResponseMap().get(orderItemResponse.getProductId()).getCategory())
                    .quantity(orderItemResponse.getQuantity())
                    .unitPrice(orderItemResponse.getPrice())
                    .revenue(orderItemResponse.getAmount())
                    .build());
        }
        OrderAnalyticsDetails orderAnalyticsDetails = OrderAnalyticsDetails.builder()
                .orderId(orderConfirmedEvent.orderId())
                .userId(orderConfirmedEvent.userId())
                .soldAt(orderConfirmedEvent.createdAt())
                .items(items)
                .build();
        analyticsClient.updateAnalytics(orderAnalyticsDetails);
        log.info("Analytics for order id {} published successfully",orderConfirmedEvent.orderId());
    }

}
