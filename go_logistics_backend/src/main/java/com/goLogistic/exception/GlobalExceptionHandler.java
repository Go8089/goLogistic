package com.goLogistic.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.time.Instant;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiErrorResponse> handleBadRequest(
        BadRequestException ex,
        HttpServletRequest request
    ) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(
        ResourceNotFoundException ex,
        HttpServletRequest request
    ) {
        return buildResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(
        MethodArgumentNotValidException ex,
        HttpServletRequest request
    ) {
        String details = ex.getBindingResult().getFieldErrors().stream()
            .map(this::formatFieldError)
            .collect(Collectors.joining("; "));
        return buildResponse(HttpStatus.BAD_REQUEST, "Validation Error", details, request.getRequestURI());
    }

    @ExceptionHandler({
        ConstraintViolationException.class,
        MissingServletRequestParameterException.class,
        MethodArgumentTypeMismatchException.class,
        HttpMessageNotReadableException.class
    })
    public ResponseEntity<ApiErrorResponse> handleInvalidRequest(
        Exception ex,
        HttpServletRequest request
    ) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Invalid Request", ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgument(
        IllegalArgumentException ex,
        HttpServletRequest request
    ) {
        return buildResponse(HttpStatus.BAD_REQUEST, "Bad Request", ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDenied(
        org.springframework.security.access.AccessDeniedException ex,
        HttpServletRequest request
    ) {
        return buildResponse(HttpStatus.FORBIDDEN, "Forbidden", "You do not have access to this resource.", request.getRequestURI());
    }

    @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
    public ResponseEntity<ApiErrorResponse> handleAuthentication(
        org.springframework.security.core.AuthenticationException ex,
        HttpServletRequest request
    ) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Unauthorized", "Authentication required.", request.getRequestURI());
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNoHandler(
        NoHandlerFoundException ex,
        HttpServletRequest request
    ) {
        return buildResponse(HttpStatus.NOT_FOUND, "Not Found", "The requested endpoint does not exist.", request.getRequestURI());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpected(
        Exception ex,
        HttpServletRequest request
    ) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", "Something went wrong while processing your request.", request.getRequestURI());
    }

    private ResponseEntity<ApiErrorResponse> buildResponse(
        HttpStatus status,
        String error,
        String message,
        String path
    ) {
        ApiErrorResponse response = new ApiErrorResponse(
            Instant.now(),
            status.value(),
            error,
            message,
            path
        );
        return ResponseEntity.status(status).body(response);
    }

    private String formatFieldError(FieldError error) {
        return error.getField() + ": " + error.getDefaultMessage();
    }
}
