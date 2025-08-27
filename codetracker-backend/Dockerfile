# Build stage: build the project using Maven
FROM maven:3.8.7-openjdk-18-slim AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Runtime stage: run the app on a lightweight JDK image
FROM openjdk:17-jdk-slim

# Optional: install debugging tools (remove if not needed)
RUN apt-get update && apt-get install -y \
    iputils-ping \
    curl \
    dnsutils \
    netcat \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/job-portal-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the app will run on
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]