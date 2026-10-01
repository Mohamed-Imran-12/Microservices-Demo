package com.example.productservice.exception;

public class ProductOutOfStockException extends RuntimeException{

    public ProductOutOfStockException(){
        super("product currently unavailable");
    }

    public ProductOutOfStockException(String message){
        super(message);
    }
}
