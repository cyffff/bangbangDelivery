FROM openjdk:11-jdk-slim
WORKDIR /app

# Create a simple "Hello World" JAR file
RUN echo 'package com.bangbang.search; \
public class SearchServiceApplication { \
    public static void main(String[] args) { \
        System.out.println("Search Service started"); \
        while(true) { try { Thread.sleep(1000); } catch(Exception e) {} } \
    } \
}' > SearchServiceApplication.java && \
    javac SearchServiceApplication.java && \
    jar cfe app.jar com.bangbang.search.SearchServiceApplication SearchServiceApplication.class

EXPOSE 8090

ENTRYPOINT ["java", "-jar", "app.jar"] 