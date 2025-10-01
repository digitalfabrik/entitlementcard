#!/bin/bash
cd ../backend && ./gradlew run --args="--disable-mail-service=true execute"
