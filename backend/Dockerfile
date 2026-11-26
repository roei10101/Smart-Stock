# syntax=docker/dockerfile:1
# --- Build stage ---
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# The local Maven repository lives in a BuildKit cache mount, so dependencies are
# downloaded once and reused by later builds without ending up in an image layer.
RUN --mount=type=cache,target=/root/.m2 mvn -B clean package -DskipTests

# --- Runtime stage ---
FROM eclipse-temurin:25-jre-jammy
WORKDIR /app
RUN useradd --system --uid 10001 appuser
COPY --from=build /app/target/*.jar app.jar
USER appuser
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD wget -qO- "http://127.0.0.1:${SERVER_PORT:-8080}/actuator/health" | grep -q '"status":"UP"' || exit 1
ENTRYPOINT ["java", "-jar", "app.jar"]
