package com.yourorg.appname.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

/**
 * Smart Database Configuration for Render Cloud Deployments.
 * <p>
 * Detects whether Render's managed PostgreSQL {@code DATABASE_URL} environment variable
 * (format: {@code postgresql://user:password@host:port/database}) is present, and
 * converts it into standard JDBC format ({@code jdbc:postgresql://...}) while
 * extracting authentication credentials.
 */
@Configuration
@Profile("postgres")
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${DATABASE_URL:#{null}}")
    private String databaseUrl;

    @Value("${spring.datasource.url:#{null}}")
    private String defaultJdbcUrl;

    @Value("${spring.datasource.username:#{null}}")
    private String defaultUsername;

    @Value("${spring.datasource.password:#{null}}")
    private String defaultPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        // Render passes DATABASE_URL as a standard environment variable
        String envDbUrl = System.getenv("DATABASE_URL");
        if (envDbUrl == null || envDbUrl.isBlank()) {
            envDbUrl = databaseUrl;
        }

        HikariConfig config = new HikariConfig();
        config.setDriverClassName("org.postgresql.Driver");

        if (envDbUrl != null && !envDbUrl.isBlank()) {
            log.info("Detected cloud DATABASE_URL, parsing credentials and converting to standard JDBC format...");
            try {
                // Normalize postgres:// to postgresql://
                String cleanUrl = envDbUrl.trim();
                if (cleanUrl.startsWith("postgres://")) {
                    cleanUrl = "postgresql://" + cleanUrl.substring("postgres://".length());
                }

                URI dbUri = new URI(cleanUrl);
                String userInfo = dbUri.getUserInfo();
                String username = null;
                String password = null;

                if (userInfo != null && userInfo.contains(":")) {
                    String[] credentials = userInfo.split(":", 2);
                    username = credentials[0];
                    password = credentials[1];
                } else if (userInfo != null) {
                    username = userInfo;
                }

                int port = dbUri.getPort() != -1 ? dbUri.getPort() : 5432;
                String path = dbUri.getPath();
                String dbName = (path != null && path.length() > 1) ? path.substring(1) : "sportzone_db";

                // Construct standard JDBC URL for PostgreSQL
                String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", dbUri.getHost(), port, dbName);

                // Preserve query parameters if present, otherwise set standard sslmode
                if (dbUri.getQuery() != null && !dbUri.getQuery().isBlank()) {
                    jdbcUrl += "?" + dbUri.getQuery();
                } else {
                    jdbcUrl += "?sslmode=require";
                }

                log.info("Successfully adapted JDBC URL: jdbc:postgresql://{}:{}/{}", dbUri.getHost(), port, dbName);
                config.setJdbcUrl(jdbcUrl);
                if (username != null) {
                    config.setUsername(username);
                }
                if (password != null) {
                    config.setPassword(password);
                }
            } catch (URISyntaxException e) {
                log.warn("Failed to parse DATABASE_URL as URI, applying fallback formatting: {}", e.getMessage());
                String fallbackUrl = envDbUrl.startsWith("jdbc:") ? envDbUrl : "jdbc:" + envDbUrl;
                config.setJdbcUrl(fallbackUrl);
                if (defaultUsername != null) config.setUsername(defaultUsername);
                if (defaultPassword != null) config.setPassword(defaultPassword);
            }
        } else {
            log.info("No DATABASE_URL found. Utilizing standard spring.datasource configuration for PostgreSQL");
            config.setJdbcUrl(defaultJdbcUrl != null ? defaultJdbcUrl : "jdbc:postgresql://localhost:5432/sportzone_db");
            if (defaultUsername != null) config.setUsername(defaultUsername);
            if (defaultPassword != null) config.setPassword(defaultPassword);
        }

        // Hikari Connection Pool Settings for Cloud
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setIdleTimeout(30000);
        config.setMaxLifetime(1800000);
        config.setConnectionTimeout(30000);
        config.setPoolName("SportZoneRenderHikariPool");

        return new HikariDataSource(config);
    }
}
