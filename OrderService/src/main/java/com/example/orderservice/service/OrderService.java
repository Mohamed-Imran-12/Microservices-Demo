package com.example.orderservice.service;

import com.example.orderservice.client.AnalyticsClient;
import com.example.orderservice.client.ProductClient;
import com.example.orderservice.client.UserClient;
import com.example.orderservice.dto.*;
import com.example.orderservice.exception.OrderNotFoundException;
import com.example.orderservice.exception.OrderProcessingException;
import com.example.orderservice.model.Order;
import com.example.orderservice.model.OrderItem;
import com.example.orderservice.model.OrderStatus;
import com.example.orderservice.repository.OrderItemRepository;
import com.example.orderservice.repository.OrderRepository;
import feign.FeignException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final UserClient userClient;
    private final ProductClient productClient;
    private final AnalyticsClient analyticsClient;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ApplicationEventPublisher applicationEventPublisher;


    @Transactional
    public OrderResponse createOrder(OrderRequest orderRequest, String email) {
        SalesOrderRequest salesOrderRequest = null;
        boolean isProcessed = false;
        try {
            UserResponse user = userClient.getUser(orderRequest.getUserId()).getBody();
            if (!user.getEmail().equals(email)){
                throw new OrderProcessingException();
            }
            BigDecimal totalAmount = BigDecimal.ZERO;

            Order order = Order.builder()
                    .userId(orderRequest.getUserId())
                    .status(OrderStatus.CREATED)
                    .totalAmount(totalAmount)
                    .build();
            orderRepository.save(order);

            List<Long> productIds = orderRequest.getItems()
                    .stream()
                    .map(OrderItemRequest::getProductId)
                    .distinct()
                    .toList();

            List<ProductDetails> productDetails = new ArrayList<>();
            List<OrderItemResponse> orderItemResponses = new ArrayList<>();

            Map<Long,ProductResponse> productResponses = productClient.getAllProductsByIds(productIds).getBody();

            for (OrderItemRequest orderItemRequest : orderRequest.getItems()) {

                ProductResponse product = productResponses.get(orderItemRequest.getProductId());

                if (product.getStock() < orderItemRequest.getQuantity()) {
                    throw new OrderProcessingException("Product id " + orderItemRequest.getProductId() + " out of stock");
                }

                product.setStock(product.getStock()-orderItemRequest.getQuantity());

                productDetails.add(ProductDetails.builder()
                        .productId(orderItemRequest.getProductId())
                        .quantity(orderItemRequest.getQuantity())
                        .build());

                orderItemResponses.add(OrderItemResponse.builder()
                        .productId(product.getId())
                        .productName(product.getName())
                        .quantity(orderItemRequest.getQuantity())
                        .price(product.getPrice())
                        .amount(BigDecimal.valueOf(orderItemRequest.getQuantity()).multiply(product.getPrice()))
                        .build());

                OrderItem orderItem = OrderItem.builder()
                        .orderId(order.getId())
                        .productId(orderItemRequest.getProductId())
                        .quantity(orderItemRequest.getQuantity())
                        .price(product.getPrice())
                        .build();

                totalAmount = totalAmount.add(BigDecimal.valueOf(orderItemRequest.getQuantity()).multiply(product.getPrice()));
                orderItemRepository.save(orderItem);
            }

            salesOrderRequest = SalesOrderRequest.builder()
                    .items(productDetails)
                    .build();
            productClient.processOrder(salesOrderRequest);
            isProcessed = true;
            order.setTotalAmount(totalAmount);
            order.setStatus(OrderStatus.CONFIRMED);

            applicationEventPublisher.publishEvent(OrderConfirmedEvent.builder()
                    .orderId(order.getId())
                    .userId(order.getUserId())
                    .createdAt(order.getCreatedAt())
                    .orderItemResponses(orderItemResponses)
                    .productResponseMap(productResponses)
                    .build());

            return OrderResponse.builder()
                    .id(order.getId())
                    .userId(orderRequest.getUserId())
                    .totalAmount(totalAmount)
                    .status(OrderStatus.CONFIRMED)
                    .createdAt(order.getCreatedAt())
                    .items(orderItemResponses)
                    .build();
        } catch (OrderProcessingException e) {
            throw e;
        } catch (FeignException e) {
            if (isProcessed) {
                productClient.processReturnedOrder(salesOrderRequest);
            }
            throw e;
        } catch (RuntimeException e) {
            if (isProcessed) {
                productClient.processReturnedOrder(salesOrderRequest);
            }
            throw new OrderProcessingException("Unable to accept order right now", e);
        }
    }

    public List<OrderDetails> getOrders(Long userId, String email, String role) {
        UserResponse userResponse = userClient.getUser(userId).getBody();
        if ("USER".equals(role) && ! email.equals(userResponse.getEmail())){
            throw new OrderNotFoundException();
        }
        return orderRepository.findAllByUserId(userId)
                .stream()
                .map(order -> OrderDetails.builder()
                        .id(order.getId())
                        .userId(order.getUserId())
                        .totalAmount(order.getTotalAmount())
                        .status(order.getStatus())
                        .createdAt(order.getCreatedAt())
                        .build())
                .toList();
    }

    public OrderResponse getOrder(Long orderId, String email, String role) {
        Order order = orderRepository.findById(orderId).orElseThrow(() ->
                new OrderNotFoundException("Order id " + orderId + " not exist"));
        UserResponse user = userClient.getUser(order.getUserId()).getBody();
        if ("USER".equals(role) && !user.getEmail().equals(email)){
            throw new OrderNotFoundException();
        }
        List<OrderItem> orderItems = orderItemRepository.findAllByOrderId(orderId);
        Map<Long, ProductResponse> productResponses = productClient.getAllProductsByIds(
                orderItems
                        .stream()
                        .map(OrderItem::getProductId)
                        .toList()
        ).getBody();
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .items(orderItems.stream()
                        .map(orderItem -> OrderItemResponse.builder()
                                .productId(orderItem.getProductId())
                                .productName(productResponses.get(orderItem.getProductId()).getName())
                                .quantity(orderItem.getQuantity())
                                .price(orderItem.getPrice())
                                .amount(BigDecimal.valueOf(orderItem.getQuantity()).multiply(orderItem.getPrice()))
                                .build())
                        .toList()
                )
                .build();
    }


    public OrderResponse cancelOrder(Long orderId, String email, String role) {
        Order order = orderRepository.findById(orderId).orElseThrow(()->
                new OrderNotFoundException("Order id " + orderId + " not exist"));
        UserResponse user = userClient.getUser(order.getUserId()).getBody();
        if ("USER".equals(role) && !user.getEmail().equals(email)){
            throw new OrderNotFoundException();
        }
        List<OrderItem> orderItems = orderItemRepository.findAllByOrderId(orderId);
        if(order.getStatus() != OrderStatus.CANCELLED){
            List<ProductDetails> productDetails = orderItems.stream()
                    .map(orderItem -> ProductDetails.builder()
                            .productId(orderItem.getProductId())
                            .quantity(orderItem.getQuantity())
                            .build())
                    .toList();
            SalesOrderRequest salesOrderRequest = SalesOrderRequest.builder()
                    .items(productDetails)
                    .build();
            productClient.processReturnedOrder(salesOrderRequest);
            order.setStatus(OrderStatus.CANCELLED);
            orderRepository.save(order);
            analyticsClient.restoreAnalytics(orderId);
        }
        List<Long> productIds = orderItems.stream()
                .map(OrderItem::getProductId)
                .distinct()
                .toList();
        Map<Long,ProductResponse> productResponseMap = productClient.getAllProductsByIds(productIds).getBody();
        List<OrderItemResponse> items = orderItems.stream()
                .map(orderItem -> OrderItemResponse.builder()
                        .productId(orderItem.getProductId())
                        .productName(productResponseMap.get(orderItem.getProductId()).getName())
                        .quantity(orderItem.getQuantity())
                        .price(orderItem.getPrice())
                        .amount(BigDecimal.valueOf(orderItem.getQuantity()).multiply(orderItem.getPrice()))
                        .build())
                .toList();
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .items(items)
                .build();
    }
}
