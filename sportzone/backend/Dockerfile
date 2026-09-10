# ==========================================================
# Multi-Stage Dockerfile: SportZone Backend (Spring Boot 3)
# ==========================================================

# ----------------------------------------------------------
# Stage 1: Build & Package Artifact
# ----------------------------------------------------------
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Cache dependencies layer
COPY pom.xml .
RUN mvn dependency:resolve -B

# Build application JAR skipping tests
COPY src ./src
RUN mvn clean package -DskipTests -B

# ----------------------------------------------------------
# Stage 2: Minimal, Secure Production JRE Container
# ----------------------------------------------------------
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create secure, isolated non-root user and group
RUN addgroup --system --gid 1001 spring && \
    adduser --system --uid 1001 --ingroup spring spring

# Copy compiled JAR from builder stage with appropriate permissions
COPY --from=builder --chown=spring:spring /app/target/*.jar app.jar

# Run with non-root security context
USER spring:spring

# Environment defaults (overridden dynamically by Render at runtime)
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=postgres

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-Dserver.address=0.0.0.0", "-jar", "app.jar"]
