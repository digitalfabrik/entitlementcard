#!/bin/bash
cd ../backend && ./gradlew run --args="--disable-application-emails=true execute"
