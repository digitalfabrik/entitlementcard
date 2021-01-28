#!/bin/bash

cp ../specs/stores-api.graphql stores.schema.graphql
cp ../specs/verification-api.graphql verification.schema.graphql
flutter pub run build_runner build --delete-conflicting-outputs
rm ./*.schema.graphql
