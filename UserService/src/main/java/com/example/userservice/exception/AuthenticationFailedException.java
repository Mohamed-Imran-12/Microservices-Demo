package com.example.userservice.exception;

public class AuthenticationFailedException  extends RuntimeException{
    public AuthenticationFailedException(){
        super("Invalid credentials");
    }
    public AuthenticationFailedException(String message,Exception e){
        super(message,e);
    }
}
