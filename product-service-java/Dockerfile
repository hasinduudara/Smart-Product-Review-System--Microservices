FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY . .

RUN sed -i 's/\r$//' mvnw

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

RUN find target -name "*.jar" ! -name "*plain.jar" -exec cp {} app.jar \;

CMD ["java", "-jar", "app.jar"]