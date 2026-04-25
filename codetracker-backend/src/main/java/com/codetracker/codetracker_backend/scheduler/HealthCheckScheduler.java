package com.codetracker.codetracker_backend.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.io.File;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Component
@RequiredArgsConstructor
public class HealthCheckScheduler {

    private final DataSource dataSource;
    private final RedisConnectionFactory redisConnectionFactory;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // Runs every 12 hours; 1-minute initial delay so the app is fully started
    @Scheduled(initialDelay = 60_000, fixedRate = 12 * 60 * 60 * 1000)
    public void runHealthCheck() {
        log.info("=== Health Check @ {} ===", LocalDateTime.now().format(FORMATTER));
        checkDatabase();
        checkRedis();
        checkJvmMemory();
        checkDiskSpace();
        log.info("=== Health Check Complete ===");
    }

    private void checkDatabase() {
        try (Connection conn = dataSource.getConnection()) {
            if (conn.isValid(5)) {
                log.info("[DB] Status: UP | Catalog: {}", conn.getCatalog());
            } else {
                log.error("[DB] Status: DOWN — connection not valid");
            }
        } catch (Exception e) {
            log.error("[DB] Status: DOWN — {}", e.getMessage());
        }
    }

    private void checkRedis() {
        try (var conn = redisConnectionFactory.getConnection()) {
            String pong = conn.ping();
            if ("PONG".equalsIgnoreCase(pong)) {
                log.info("[Redis] Status: UP");
            } else {
                log.warn("[Redis] Status: DEGRADED — unexpected ping response: {}", pong);
            }
        } catch (Exception e) {
            log.error("[Redis] Status: DOWN — {}", e.getMessage());
        }
    }

    private void checkJvmMemory() {
        Runtime rt    = Runtime.getRuntime();
        long maxMb    = rt.maxMemory()   / (1024 * 1024);
        long totalMb  = rt.totalMemory() / (1024 * 1024);
        long usedMb   = totalMb - rt.freeMemory() / (1024 * 1024);
        double usedPct = maxMb > 0 ? (double) usedMb / maxMb * 100 : 0;

        log.info("[JVM Memory] Status: {} | Used: {} MB / {} MB ({} %)",
                usedPct < 85 ? "OK" : "WARN", usedMb, maxMb,
                String.format("%.1f", usedPct));
    }

    private void checkDiskSpace() {
        File root     = new File("/");
        long totalGb  = root.getTotalSpace() / (1024 * 1024 * 1024);
        long freeGb   = root.getFreeSpace()  / (1024 * 1024 * 1024);
        long usedGb   = totalGb - freeGb;
        double usedPct = totalGb > 0 ? (double) usedGb / totalGb * 100 : 0;

        log.info("[Disk] Status: {} | Used: {} GB / {} GB ({} %)",
                usedPct < 85 ? "OK" : "WARN", usedGb, totalGb,
                String.format("%.1f", usedPct));
    }
}
