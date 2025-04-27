FROM openjdk:11-jdk-slim
WORKDIR /app

# Create a simple "Hello World" JAR file
RUN echo 'package com.bangbang.messaging; \
public class MessagingServiceApplication { \
    public static void main(String[] args) { \
        System.out.println("Messaging Service started"); \
        while(true) { try { Thread.sleep(1000); } catch(Exception e) {} } \
    } \
}' > MessagingServiceApplication.java && \
    javac MessagingServiceApplication.java && \
    jar cfe app.jar com.bangbang.messaging.MessagingServiceApplication MessagingServiceApplication.class

EXPOSE 8087

ENTRYPOINT ["java", "-jar", "app.jar"] 