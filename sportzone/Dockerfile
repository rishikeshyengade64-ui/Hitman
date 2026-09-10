# ==========================================================
# Multi-Stage Dockerfile: SportZone (sportzone directory)
# ==========================================================

# ----------------------------------------------------------
# Stage 1: Build & Package Backend JAR
# ----------------------------------------------------------
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Cache dependencies
COPY backend/pom.xml ./pom.xml
RUN mvn dependency:go-offline -B

# Copy backend source and build JAR
COPY backend/src ./src
RUN mvn clean package -DskipTests -B

# ----------------------------------------------------------
# Stage 2: Minimal, Secure Production JRE Container
# ----------------------------------------------------------
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create secure, isolated non-root user and group
RUN addgroup --system --gid 1001 spring && \
    adduser --system --uid 1001 --ingroup spring spring

COPY --from=builder --chown=spring:spring /app/target/*.jar app.jar

USER spring:spring

ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=postgres

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
