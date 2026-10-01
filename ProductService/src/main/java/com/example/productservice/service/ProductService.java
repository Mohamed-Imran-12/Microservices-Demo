package com.example.productservice.service;

import com.example.productservice.dto.*;
import com.example.productservice.exception.IllegalTransactionTypeException;
import com.example.productservice.exception.ProductNotFoundException;
import com.example.productservice.exception.ProductOutOfStockException;
import com.example.productservice.model.Product;
import com.example.productservice.model.StockTransaction;
import com.example.productservice.model.StockTransactionType;
import com.example.productservice.repository.ProductRepository;
import com.example.productservice.repository.StockTransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final StockTransactionRepository stockTransactionRepository;

    @Transactional
    public ProductResponse createProduct(ProductRequest productRequest) {
        Product product = Product.builder()
                .name(productRequest.getName())
                .category(productRequest.getCategory())
                .price(productRequest.getPrice())
                .stock(productRequest.getStock())
                .imageUrl(productRequest.getImageUrl())
                .build();
        productRepository.save(product);
        StockTransaction stockTransaction = StockTransaction.builder()
                .productId(product.getId())
                .type(StockTransactionType.PURCHASE)
                .quantity(productRequest.getStock())
                .build();
        stockTransactionRepository.save(stockTransaction);
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .category(product.getCategory())
                .price(product.getPrice())
                .stock(product.getStock())
                .imageUrl(product.getImageUrl())
                .build();
    }

    public List<ProductResponse> getProducts() {
        return productRepository.findAll()
                .stream()
                .map(p ->
                        ProductResponse.builder()
                                .id(p.getId())
                                .name(p.getName())
                                .category(p.getCategory())
                                .price(p.getPrice())
                                .stock(p.getStock())
                                .imageUrl(p.getImageUrl())
                                .build())
                .toList();
    }

    public ProductResponse getProduct(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() ->
                new ProductNotFoundException("Product id " + id + " not exist")
        );
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .category(product.getCategory())
                .price(product.getPrice())
                .stock(product.getStock())
                .imageUrl(product.getImageUrl())
                .build();
    }

    @Transactional
    public ProductResponse updateProduct(ProductUpdateRequest productUpdateRequest) {
        Product product = productRepository.findById(productUpdateRequest.getId()).orElseThrow(() ->
                new ProductNotFoundException("Product id " + productUpdateRequest.getId() + " not exist")
        );
        product.setName(productUpdateRequest.getName());
        product.setCategory(productUpdateRequest.getCategory());
        product.setPrice(productUpdateRequest.getPrice());
        product.setImageUrl(productUpdateRequest.getImageUrl());
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .category(product.getCategory())
                .price(product.getPrice())
                .stock(product.getStock())
                .imageUrl(product.getImageUrl())
                .build();
    }

    @Transactional
    public ProductResponse restockProduct(ProductStockUpdateRequest productStockUpdateRequest) {
        if (productStockUpdateRequest.getType() != StockTransactionType.RESTOCK) {
            throw new IllegalTransactionTypeException(productStockUpdateRequest.getType() + " is transaction not allowed");
        }
        Product product = productRepository.findByIdForUpdate(productStockUpdateRequest.getId())
                .orElseThrow(() ->
                        new ProductNotFoundException("Product id " + productStockUpdateRequest.getId() + " not exist"));
        product.setStock(product.getStock() + productStockUpdateRequest.getQuantity());
        StockTransaction stockTransaction = StockTransaction.builder()
                .productId(productStockUpdateRequest.getId())
                .type(productStockUpdateRequest.getType())
                .quantity(productStockUpdateRequest.getQuantity())
                .build();
        stockTransactionRepository.save(stockTransaction);
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .category(product.getCategory())
                .price(product.getPrice())
                .stock(product.getStock())
                .imageUrl(product.getImageUrl())
                .build();
    }

    public List<ProductLowStockResponse> getLowStockProducts() {
        return productRepository.findProductsByLowStock();
    }

    public List<ProductTransactionResponse> getProductTransactions(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ProductNotFoundException("Product id " + productId + " not exist");
        }
        return stockTransactionRepository.findAllByProductId(productId)
                .stream()
                .map(transaction -> ProductTransactionResponse.builder()
                        .id(transaction.getId())
                        .productId(transaction.getProductId())
                        .type(transaction.getType())
                        .quantity(transaction.getQuantity())
                        .createdAt(transaction.getCreatedAt())
                        .build())
                .toList();
    }

    @Transactional
    public String processOrder(SalesOrderRequest salesOrderRequest) {
        List<ProductDetails> items = salesOrderRequest.getItems()
                .stream()
                .sorted(Comparator.comparing(ProductDetails::getProductId))
                .toList();
        for (ProductDetails productDetails : items) {
            Product product = productRepository.findByIdForUpdate(productDetails.getProductId()).orElseThrow(() ->
                    new ProductNotFoundException("Product id " + productDetails.getProductId() + " not exist"));
            if (product.getStock() < productDetails.getQuantity()) {
                throw new ProductOutOfStockException("Product id " + productDetails.getProductId() + " currently unavailable");
            }
            StockTransaction stockTransaction = StockTransaction.builder()
                    .productId(product.getId())
                    .type(StockTransactionType.SALE)
                    .quantity(productDetails.getQuantity())
                    .build();
            stockTransactionRepository.save(stockTransaction);
            product.setStock(product.getStock() - productDetails.getQuantity());
        }
        return "Successfully order processed";
    }

    @Transactional
    public String processReturnedOrder(SalesOrderRequest salesOrderRequest) {
        List<ProductDetails> items = salesOrderRequest.getItems()
                .stream()
                .sorted(Comparator.comparing(ProductDetails::getProductId))
                .toList();
        for (ProductDetails productDetails : items) {
            Product product = productRepository.findByIdForUpdate(productDetails.getProductId()).orElseThrow(() ->
                    new ProductNotFoundException("Product id " + productDetails.getProductId() + " not exist"));
            StockTransaction stockTransaction = StockTransaction.builder()
                    .productId(product.getId())
                    .type(StockTransactionType.RETURN)
                    .quantity(productDetails.getQuantity())
                    .build();
            stockTransactionRepository.save(stockTransaction);
            product.setStock(product.getStock() + productDetails.getQuantity());
        }
        return "Successfully return processed";
    }

    public Map<Long, ProductResponse> getAllProductsByIds(List<Long> productIds) {
        List<Product> products = productRepository.findAllById(productIds);
        Map<Long, ProductResponse> productResponses = new HashMap<>();
        for (Product product : products) {
            productResponses.put(product.getId(), ProductResponse.builder()
                    .id(product.getId())
                    .name(product.getName())
                    .category(product.getCategory())
                    .price(product.getPrice())
                    .stock(product.getStock())
                    .imageUrl(product.getImageUrl())
                    .build());
        }
        for (Long productId : productIds) {
            if (!productResponses.containsKey(productId)) {
                throw new ProductNotFoundException(
                        "Product id " + productId + " not exist"
                );
            }
        }
        return productResponses;
    }

    public List<ProductSearchResponse> searchProductByKeyword(String keyword) {
        return productRepository.findProductByKeyword("%" + keyword + "%");
    }
}
