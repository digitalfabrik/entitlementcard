FROM gradle:jdk8 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN ./gradlew build --no-daemon
RUN unzip /home/gradle/src/build/distributions/backend.zip -d /output

FROM openjdk:8-jre-slim
EXPOSE 8080

RUN mkdir /backend
COPY --from=build /output/* /backend/
ENTRYPOINT ["/backend/bin/backend"]
