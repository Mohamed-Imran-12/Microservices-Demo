package com.example.productservice.controller;

import com.example.productservice.dto.*;
import com.example.productservice.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/product-service")
public class ProductController {

    private final ProductService productService;

    @PostMapping("/product")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest productRequest){
        ProductResponse body = productService.createProduct(productRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductResponse>> getProducts(){
        List<ProductResponse> body = productService.getProducts();
        return ResponseEntity.ok(body);
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<ProductResponse> getProducts(@PathVariable Long id){
        ProductResponse body = productService.getProduct(id);
        return ResponseEntity.ok(body);
    }

    @PutMapping("/product")
    public ResponseEntity<ProductResponse> updateProduct(@Valid @RequestBody ProductUpdateRequest productUpdateRequest){
        ProductResponse body = productService.updateProduct(productUpdateRequest);
        return ResponseEntity.ok(body);
    }

    @PutMapping("/product/stock")
    public ResponseEntity<ProductResponse> restockProduct(@Valid @RequestBody ProductStockUpdateRequest productStockUpdateRequest){
        ProductResponse body = productService.restockProduct(productStockUpdateRequest);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/products/low-stock")
    public ResponseEntity<List<ProductLowStockResponse>> getLowStockProducts(){
        List<ProductLowStockResponse> body = productService.getLowStockProducts();
        return ResponseEntity.ok(body);
    }

    @GetMapping("/product/transactions/{product-id}")
    public ResponseEntity<List<ProductTransactionResponse>> getProductTransactions(@PathVariable ("product-id") Long productId){
        List<ProductTransactionResponse> body = productService.getProductTransactions(productId);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/product/order")
    public ResponseEntity<String> processOrder(@Valid @RequestBody SalesOrderRequest salesOrderRequest){
        String body = productService.processOrder(salesOrderRequest);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/product/return")
    public ResponseEntity<String> processReturnedOrder(@Valid @RequestBody SalesOrderRequest salesOrderRequest){
        String body = productService.processReturnedOrder(salesOrderRequest);
        return ResponseEntity.ok(body);
    }

    @PostMapping("/products/ids")
    public ResponseEntity<Map<Long,ProductResponse>> getAllProductsByIds(@RequestBody List<Long> productIds){
        Map<Long,ProductResponse> body = productService.getAllProductsByIds(productIds);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/product/search/{keyword}")
    public ResponseEntity<List<ProductSearchResponse>> searchProductByKeyword(@PathVariable String keyword){
        List<ProductSearchResponse> body = productService.searchProductByKeyword(keyword);
        return ResponseEntity.ok(body);
    }

}
