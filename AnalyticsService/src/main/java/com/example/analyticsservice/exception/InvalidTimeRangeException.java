package com.example.analyticsservice.exception;

public class InvalidTimeRangeException extends RuntimeException{

    public InvalidTimeRangeException(){
        super("Invalid FROM and TO range");
    }
    public InvalidTimeRangeException(String message){
        super(message);
    }

}
