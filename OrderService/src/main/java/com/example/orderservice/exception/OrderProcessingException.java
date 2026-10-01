package com.example.orderservice.exception;

public class OrderProcessingException extends RuntimeException{

    public OrderProcessingException(){
        super("Order placement failed");
    }

    public OrderProcessingException(String message){
        super(message);
    }

    public OrderProcessingException(String message,Exception e){
        super(message,e);
    }
}
