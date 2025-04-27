FROM openjdk:11-jdk-slim
WORKDIR /app

# Create a simple "Hello World" JAR file
RUN echo 'package com.bangbang.notification; \
public class NotificationServiceApplication { \
    public static void main(String[] args) { \
        System.out.println("Notification Service started"); \
        while(true) { try { Thread.sleep(1000); } catch(Exception e) {} } \
    } \
}' > NotificationServiceApplication.java && \
    javac NotificationServiceApplication.java && \
    jar cfe app.jar com.bangbang.notification.NotificationServiceApplication NotificationServiceApplication.class

EXPOSE 8089

ENTRYPOINT ["java", "-jar", "app.jar"] 