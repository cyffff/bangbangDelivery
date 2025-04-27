FROM maven:3.8-openjdk-11 as build
WORKDIR /app

# Copy the pom.xml
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src/ ./src/

# Build the application
RUN mvn clean package -DskipTests

# Runtime image
FROM openjdk:11-jre-slim
WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy the JAR file
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081

# Environment variables
ENV SPRING_PROFILES_ACTIVE=docker
ENV SERVER_PORT=8081
ENV APP_JWT_SECRET=9a02115a835ee03d5fb83cd8a468ea33e4090aaaec87f53c9fa54512bbef4db8dc656c82a315fa0c785c08b0134716b81ddcd0153d2a7556f2e154912cf5675f
ENV APP_JWT_EXPIRATION=86400000
ENV APP_JWT_REFRESHEXPIRATION=604800000

# Healthcheck to ensure the service is running properly
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8081/api/v1/actuator/health || exit 1

# Run the application with connection retry settings
ENTRYPOINT ["java", "-Dspring.datasource.tomcat.max-wait=10000", "-Dspring.datasource.tomcat.max-active=50", "-Dspring.datasource.tomcat.test-on-borrow=true", "-jar", "app.jar"]