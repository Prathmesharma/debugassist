# Stage 1: Build the JAR using Maven
FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
# Copy pom.xml first so dependencies are cached
COPY pom.xml .
RUN mvn dependency:go-offline -B
# Copy source and build
COPY src ./src
RUN mvn package -DskipTests -B

# Stage 2: Run with slim JRE image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/debugassist-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
