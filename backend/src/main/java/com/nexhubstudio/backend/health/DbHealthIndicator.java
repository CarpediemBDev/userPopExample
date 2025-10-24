package com.nexhubstudio.backend.health;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

@Component
public class DbHealthIndicator implements HealthIndicator {

    @Autowired(required = false)
    private JdbcTemplate jdbcTemplate;

    @Override
    public Health health() {
        if (jdbcTemplate == null) {
            return Health.unknown().withDetail("database", "NOT_CONFIGURED").build();
        }
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return Health.up().withDetail("database", "UP").build();
        } catch (Exception e) {
            return Health.down(e).withDetail("database", "DOWN").build();
        }
    }
}
