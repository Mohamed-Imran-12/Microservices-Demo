package com.example.productservice.exception;

public class IllegalTransactionTypeException extends RuntimeException{

    public IllegalTransactionTypeException(){
        super("Illegal transaction type");
    }
    public IllegalTransactionTypeException(String message){
        super(message);
    }
}
