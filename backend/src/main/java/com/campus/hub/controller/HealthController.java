package com.campus.hub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping
    public Map<String, Object> getHealth() {
        Map<String, Object> health = new HashMap<>();
        try {
            // Check if we can reach the database
            mongoTemplate.getDb().listCollectionNames().first();
            health.put("status", "UP");
            health.put("database", "MongoDB Connected");
        } catch (Exception e) {
            health.put("status", "DOWN");
            health.put("database", "MongoDB Disconnected: " + e.getMessage());
        }
        return health;
    }
}
