package com.example.orderservice.client;

import com.example.orderservice.dto.ProductResponse;
import com.example.orderservice.dto.SalesOrderRequest;
import jakarta.validation.Valid;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;

@SuppressWarnings("UnusedReturnValue")
@FeignClient("productservice")
public interface ProductClient {


    @PostMapping("/product-service/product/order")
    ResponseEntity<String> processOrder(@Valid @RequestBody SalesOrderRequest salesOrderRequest);

    @PostMapping("/product-service/product/return")
    ResponseEntity<String> processReturnedOrder(@Valid @RequestBody SalesOrderRequest salesOrderRequest);

    @PostMapping("/product-service/products/ids")
    ResponseEntity<Map<Long,ProductResponse>> getAllProductsByIds(@RequestBody List<Long> productIds);

}

