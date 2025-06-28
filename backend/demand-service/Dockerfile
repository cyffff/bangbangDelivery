FROM openjdk:11-jdk-slim
WORKDIR /app

# Copy Java source file
COPY src/main/java/com/bangbang/demand/SimpleDemandService.java .

# Compile and create JAR (include all generated class files)
RUN javac SimpleDemandService.java && \
    jar cfe app.jar SimpleDemandService *.class

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "app.jar"] 