FROM gradle:jdk8 AS build

WORKDIR /home/gradle/src
COPY --chown=gradle:gradle . .
RUN ./gradlew build --no-daemon
RUN unzip build/distributions/backend.zip -d /output

FROM openjdk:8-jre-slim

WORKDIR /backend
COPY --from=build /output/* .
ENTRYPOINT ["./bin/backend", "execute"]
