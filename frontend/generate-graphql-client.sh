#!/bin/bash

cp ../specs/backend-api.graphql schema.graphql
flutter pub run build_runner build --delete-conflicting-outputs
rm schema.graphql
