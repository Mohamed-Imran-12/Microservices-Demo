package com.example.productservice.exception;

public class ProductNotFoundException extends RuntimeException {

    public ProductNotFoundException() {
        super("Product not exist");
    }

    public ProductNotFoundException(String message) {
        super(message);
    }

}
