package com.codetracker.codetracker_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminUserDto {
    private String id;
    private String name;
    private String email;
    private String role;
    private String bio;
    private String registrationDate;
    private int problemsSolved;
    private String status;
}
