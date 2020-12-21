FROM gradle:jdk11 AS build

WORKDIR /home/gradle/src
COPY --chown=gradle:gradle . .
RUN ./gradlew build --no-daemon
RUN unzip build/distributions/backend.zip -d /output

FROM adoptopenjdk:11-jdk-hotspot

WORKDIR /backend
COPY --from=build /output/* .
ENTRYPOINT ["./bin/backend"]
