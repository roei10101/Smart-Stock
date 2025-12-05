# Stage 1: Build the application
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -Djava.net.preferIPv6Addresses=true -Djava.net.preferIPv4Stack=false clean package -DskipTests
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 6000
ENTRYPOINT ["java", "-jar", "app.jar"]
