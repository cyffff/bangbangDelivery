FROM openjdk:11-jdk-slim
WORKDIR /app

# Create a simple "Hello World" JAR file
RUN echo 'package com.bangbang.demand; \
public class DemandServiceApplication { \
    public static void main(String[] args) { \
        System.out.println("Demand Service started"); \
        while(true) { try { Thread.sleep(1000); } catch(Exception e) {} } \
    } \
}' > DemandServiceApplication.java && \
    javac DemandServiceApplication.java && \
    jar cfe app.jar com.bangbang.demand.DemandServiceApplication DemandServiceApplication.class

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "app.jar"] 