FROM openjdk:11-jdk-slim
WORKDIR /app

# Create a simple "Hello World" JAR file
RUN echo 'package com.bangbang.payment; \
public class PaymentServiceApplication { \
    public static void main(String[] args) { \
        System.out.println("Payment Service started"); \
        while(true) { try { Thread.sleep(1000); } catch(Exception e) {} } \
    } \
}' > PaymentServiceApplication.java && \
    javac PaymentServiceApplication.java && \
    jar cfe app.jar com.bangbang.payment.PaymentServiceApplication PaymentServiceApplication.class

EXPOSE 8086

ENTRYPOINT ["java", "-jar", "app.jar"] 