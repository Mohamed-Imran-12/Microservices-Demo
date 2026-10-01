package com.example.productservice.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(Exception e) {
        return createErrorResponse("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR, e);
    }

    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleProductNotFoundException(ProductNotFoundException e){
        return createErrorResponse(e.getMessage(),HttpStatus.NOT_FOUND,e);
    }

    @ExceptionHandler(ProductOutOfStockException.class)
    public ResponseEntity<Map<String, Object>> handleProductOutOfStockException(ProductOutOfStockException e){
        return createErrorResponse(e.getMessage(),HttpStatus.CONFLICT,e);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        return createErrorResponse(e.getAllErrors().getFirst().getDefaultMessage(), HttpStatus.BAD_REQUEST, e);
    }

    @ExceptionHandler(IllegalTransactionTypeException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalTransactionTypeException(IllegalTransactionTypeException e) {
        return createErrorResponse(e.getMessage(), HttpStatus.BAD_REQUEST, e);
    }

    private ResponseEntity<Map<String, Object>> createErrorResponse(String message, HttpStatus status, Exception e) {
        Map<String, Object> map = new LinkedHashMap<>();
        log.error(e.getMessage(), e);
        map.put("timestamp", LocalDateTime.now());
        map.put("status", status.value());
        map.put("error", status.getReasonPhrase());
        map.put("message", message);
        return ResponseEntity.status(status).body(map);

    }
}
