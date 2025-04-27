FROM openjdk:11-jdk-slim
WORKDIR /app

# Create a simple "Hello World" JAR file
RUN echo 'package com.bangbang.journey; \
public class JourneyServiceApplication { \
    public static void main(String[] args) { \
        System.out.println("Journey Service started"); \
        while(true) { try { Thread.sleep(1000); } catch(Exception e) {} } \
    } \
}' > JourneyServiceApplication.java && \
    javac JourneyServiceApplication.java && \
    jar cfe app.jar com.bangbang.journey.JourneyServiceApplication JourneyServiceApplication.class

EXPOSE 8085

ENTRYPOINT ["java", "-jar", "app.jar"] 