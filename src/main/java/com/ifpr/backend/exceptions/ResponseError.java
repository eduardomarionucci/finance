package com.ifpr.backend.exceptions;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResponseError {
    private int status;
    private String message;
    private LocalDateTime timestamp;
}
