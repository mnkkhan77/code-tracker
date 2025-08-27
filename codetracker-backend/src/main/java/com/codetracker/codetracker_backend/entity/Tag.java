package com.codetracker.codetracker_backend.entity;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "tags")
public class Tag {
    @Id
    @GeneratedValue
    private UUID id;
    @Column(unique=true)
    private String name;
}