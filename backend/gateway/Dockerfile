FROM openjdk:11-jre-slim
WORKDIR /app

# Create a placeholder JAR
RUN echo "dummy jar" > /app/app.jar

EXPOSE 8080

# Run a dummy service that keeps the container alive
CMD echo "Gateway Service Placeholder - Real service needs to be built manually" && tail -f /dev/null 