FROM openjdk:11-jdk-slim
WORKDIR /app

# Create a simple "Hello World" JAR file
RUN echo 'package com.bangbang.user; \
public class UserServiceApplication { \
    public static void main(String[] args) { \
        System.out.println("User Service started"); \
        while(true) { try { Thread.sleep(1000); } catch(Exception e) {} } \
    } \
}' > UserServiceApplication.java && \
    javac UserServiceApplication.java && \
    jar cfe app.jar com.bangbang.user.UserServiceApplication UserServiceApplication.class

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"] 