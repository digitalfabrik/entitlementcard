# Code Generation for GraphQL

Files are generated into [frontend/lib/graphql](../frontend/lib/graphql)
and [administration/src/generated/graphql.tsx](../administration/src/generated/graphql.tsx).
Queries are specified in [frontend/graphql_queries](../frontend/graphql_queries)
and [administration/src/graphql](../administration/src/graphql).

## Generate API Files

1. If schema changed: Generate updated GraphQL schema into [schema.graphql](../frontend/schema.graphql)
   Run "Generate GraphQL specs" in Intellij (or `./gradlew run --args="graphql-export ../specs/backend-api.graphql"` in the
   backend folder)
2. Run any "Set build config" configuration in IntelliJ e.g. "Set build config bayern" (
   or `flutter pub run build_runner build` in the `frontend` directory)
3. Run "Generate Administration GraphQL" (or `npm generate-graphql` in the `administration` directory)
