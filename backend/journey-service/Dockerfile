FROM openjdk:11-jdk-slim
WORKDIR /app

# Copy Java source file
COPY src/main/java/com/bangbang/journey/SimpleJourneyService.java .

# Compile and create JAR (include all generated class files)
RUN javac SimpleJourneyService.java && \
    jar cfe app.jar SimpleJourneyService *.class

EXPOSE 8085

ENTRYPOINT ["java", "-jar", "app.jar"] 