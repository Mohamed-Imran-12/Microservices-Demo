package com.example.analyticsservice.exception;

public class SalesAnalyticsException extends RuntimeException {
    public SalesAnalyticsException(){
        super("Sales analytics not found");
    }
    public SalesAnalyticsException(String message){
        super(message);
    }
}
