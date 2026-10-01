package com.example.orderservice.exception;

import feign.FeignException;
import feign.FeignException.FeignClientException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
@RequiredArgsConstructor
public class GlobalExceptionHandler {

    private final ObjectMapper objectMapper;

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(Exception e) {
        return createErrorResponse("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR, e);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        return createErrorResponse(e.getAllErrors().getFirst().getDefaultMessage(), HttpStatus.BAD_REQUEST, e);
    }

    @ExceptionHandler(OrderProcessingException.class)
    public ResponseEntity<Map<String, Object>> handleOrderProcessingException(OrderProcessingException e) {
        return createErrorResponse(e.getMessage(), HttpStatus.CONFLICT, e);
    }

    @ExceptionHandler(OrderNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleOrderNotFoundException(OrderNotFoundException e) {
        return createErrorResponse(e.getMessage(), HttpStatus.NOT_FOUND, e);
    }

    @ExceptionHandler(FeignException.class)
    public ResponseEntity<Map<String, Object>> handleFeignException(FeignException e) {
        try {
            if (e instanceof FeignClientException) {
                Map<String, Object> body = objectMapper.readValue(e.contentUTF8(), new TypeReference<>(){});
                log.error("Downstream service error: {}", body.get("message"), e);
                return ResponseEntity.status(e.status()).body(body);
            }
            return createErrorResponse("Service temporarily unavailable", HttpStatus.SERVICE_UNAVAILABLE, e);
        } catch (Exception ex) {
            return createErrorResponse("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR, ex);
        }
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
