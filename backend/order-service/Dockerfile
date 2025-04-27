FROM openjdk:11-jdk-slim
WORKDIR /app

# Create a simple "Hello World" JAR file
RUN echo 'package com.bangbang.order; \
public class OrderServiceApplication { \
    public static void main(String[] args) { \
        System.out.println("Order Service started"); \
        while(true) { try { Thread.sleep(1000); } catch(Exception e) {} } \
    } \
}' > OrderServiceApplication.java && \
    javac OrderServiceApplication.java && \
    jar cfe app.jar com.bangbang.order.OrderServiceApplication OrderServiceApplication.class

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "app.jar"] 