package com.example.orderservice.controller;

import com.example.orderservice.dto.OrderDetails;
import com.example.orderservice.dto.OrderRequest;
import com.example.orderservice.dto.OrderResponse;
import com.example.orderservice.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/order-service")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/order")
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody OrderRequest orderRequest, @RequestHeader("X-User-Email") String email) {
        OrderResponse body = orderService.createOrder(orderRequest, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @GetMapping("/orders/user/{userId}")
    public ResponseEntity<List<OrderDetails>> getOrders(@PathVariable Long userId, @RequestHeader("X-User-Email") String email, @RequestHeader("X-User-Role") String role) {
        List<OrderDetails> body = orderService.getOrders(userId, email, role);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable Long orderId, @RequestHeader("X-User-Email") String email, @RequestHeader("X-User-Role") String role) {
        OrderResponse body = orderService.getOrder(orderId, email, role);
        return ResponseEntity.ok(body);
    }

    @PutMapping("/order/cancel/{orderId}")
    public ResponseEntity<OrderResponse> cancelOrder(@PathVariable Long orderId, @RequestHeader("X-User-Email") String email, @RequestHeader("X-User-Role") String role) {
        OrderResponse body = orderService.cancelOrder(orderId, email, role);
        return ResponseEntity.ok(body);
    }
}
