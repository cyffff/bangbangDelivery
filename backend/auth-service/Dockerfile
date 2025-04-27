FROM openjdk:11-jdk-slim
WORKDIR /app

# Create a simple "Hello World" JAR file
RUN echo 'package com.bangbang.auth; \
public class AuthServiceApplication { \
    public static void main(String[] args) { \
        System.out.println("Auth Service started"); \
        while(true) { try { Thread.sleep(1000); } catch(Exception e) {} } \
    } \
}' > AuthServiceApplication.java && \
    javac AuthServiceApplication.java && \
    jar cfe app.jar com.bangbang.auth.AuthServiceApplication AuthServiceApplication.class

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]