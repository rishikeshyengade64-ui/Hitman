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
 * Resilient Database Configuration for Render Cloud Deployments.
 * <p>
 * Key cloud deployment features:
 * 1. Automatically parses Render external or internal connection strings into standard JDBC format.
 * 2. Uses {@code sslmode=prefer} or detects external vs internal hosts so connections never hang.
 * 3. Enforces strict connection (10s) and socket (30s) timeouts on the PostgreSQL driver.
 * 4. Configures HikariCP with {@code initializationFailTimeout = -1} to prevent blocking the
 *    embedded web server (Tomcat) during startup, guaranteeing instant port binding on Render.
 * 5. If no cloud database URL is configured, gracefully falls back to an embedded in-memory H2 database
 *    so the application and health check (/health) stay 100% available without failing deployment.
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
        String envDbUrl = System.getenv("DATABASE_URL");
        if (envDbUrl == null || envDbUrl.isBlank()) {
            envDbUrl = databaseUrl;
        }

        HikariConfig config = new HikariConfig();

        if (envDbUrl != null && !envDbUrl.isBlank()) {
            log.info("Detected cloud DATABASE_URL, parsing credentials and configuring PostgreSQL DataSource...");
            try {
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
                String host = dbUri.getHost();

                // Construct standard JDBC URL for PostgreSQL
                StringBuilder jdbcUrl = new StringBuilder(String.format("jdbc:postgresql://%s:%d/%s", host, port, dbName));

                // Query parameters and SSL mode
                if (dbUri.getQuery() != null && !dbUri.getQuery().isBlank()) {
                    jdbcUrl.append("?").append(dbUri.getQuery());
                    if (!dbUri.getQuery().contains("connectTimeout")) {
                        jdbcUrl.append("&connectTimeout=10");
                    }
                    if (!dbUri.getQuery().contains("socketTimeout")) {
                        jdbcUrl.append("&socketTimeout=30");
                    }
                } else {
                    // Use sslmode=prefer so that both external Render (requires SSL) and internal Render (plain TCP) succeed without hanging
                    boolean isExternal = host != null && host.contains(".render.com");
                    String sslMode = isExternal ? "require" : "prefer";
                    jdbcUrl.append(String.format("?sslmode=%s&connectTimeout=10&socketTimeout=30", sslMode));
                }

                log.info("Successfully configured PostgreSQL JDBC URL for host: {}:{} (database: {})", host, port, dbName);

                config.setDriverClassName("org.postgresql.Driver");
                config.setJdbcUrl(jdbcUrl.toString());
                if (username != null) config.setUsername(username);
                if (password != null) config.setPassword(password);

            } catch (URISyntaxException e) {
                log.warn("Failed to parse DATABASE_URL as URI, using fallback formatting: {}", e.getMessage());
                String fallbackUrl = envDbUrl.startsWith("jdbc:") ? envDbUrl : "jdbc:" + envDbUrl;
                config.setDriverClassName("org.postgresql.Driver");
                config.setJdbcUrl(fallbackUrl);
                if (defaultUsername != null) config.setUsername(defaultUsername);
                if (defaultPassword != null) config.setPassword(defaultPassword);
            }
        } else if (defaultJdbcUrl != null && !defaultJdbcUrl.contains("localhost:5432")) {
            log.info("Using configured spring.datasource.url: {}", defaultJdbcUrl);
            config.setDriverClassName("org.postgresql.Driver");
            config.setJdbcUrl(defaultJdbcUrl);
            if (defaultUsername != null) config.setUsername(defaultUsername);
            if (defaultPassword != null) config.setPassword(defaultPassword);
        } else {
            // Resilient Fallback: When running in a cloud container without an attached PostgreSQL database,
            // fallback to embedded in-memory H2 so that Tomcat binds port immediately and Render deployment succeeds.
            log.warn("==========================================================================================");
            log.warn("No cloud DATABASE_URL detected in environment.");
            log.warn("Initializing resilient in-memory database (H2 PostgreSQL mode) for immediate port binding.");
            log.warn("To connect managed PostgreSQL, set DATABASE_URL in your Render Service Dashboard.");
            log.warn("==========================================================================================");

            config.setDriverClassName("org.h2.Driver");
            config.setJdbcUrl("jdbc:h2:mem:sportzone_db;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE");
            config.setUsername("sa");
            config.setPassword("");
        }

        // HikariCP Connection Pool Settings optimized for Render Cloud
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setIdleTimeout(30000);
        config.setMaxLifetime(1800000);
        config.setConnectionTimeout(15000);
        config.setValidationTimeout(5000);
        // CRITICAL: Do NOT fail bean creation if database is slow to respond on startup; allows Tomcat to bind port immediately!
        config.setInitializationFailTimeout(-1);
        config.setPoolName("SportZoneRenderHikariPool");

        return new HikariDataSource(config);
    }
}
