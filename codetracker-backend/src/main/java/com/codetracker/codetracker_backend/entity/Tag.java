package com.codetracker.codetracker_backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Data
@Table(name = "tags")
public class Tag {
    @Id
    @GeneratedValue
    private UUID id;
    @Column(unique=true)
    private String name;
}