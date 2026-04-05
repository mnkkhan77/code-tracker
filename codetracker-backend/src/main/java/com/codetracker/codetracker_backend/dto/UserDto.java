package com.codetracker.codetracker_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserDto {
    private String name;
    private String bio;
    private String email;
    private String password; // optional
    private String role;

    public UserDto(String name, String bio, String email, String password) {
        this.name = name;
        this.bio = bio;
        this.email = email;
        this.password = password;
    }

    public UserDto(String name, String bio, String email, String password, String role) {
        this.name = name;
        this.bio = bio;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}
