package com.example.userservice.exception;

public class DuplicateEmailException extends RuntimeException{

    public DuplicateEmailException(){
        super("Email already registered");
    }
    public DuplicateEmailException(String message){
        super(message);
    }
}
