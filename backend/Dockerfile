# ====== Build Stage ======
FROM maven:3.9.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# ====== Test Stage ======
FROM maven:3.9.9-eclipse-temurin-21 AS tester
WORKDIR /app
COPY . .
# Run all tests (unit + integration)
CMD ["mvn", "test"]

# ====== Runtime Stage ======
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
