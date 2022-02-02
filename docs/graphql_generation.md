# Code Generation for GraphQL

Files are generated into [frontend/lib/graphql](../frontend/lib/graphql).
Queries are specified in [frontend/graphql_queries](../frontend/graphql_queries).

## Generate API Files
1. If schema changed: Generate updated GraphQL schema into [schema.graphql](../frontend/schema.graphql)
   Run "Generate GraphQL" in Intellij (or `./gradlew run --args="graphql-export ../specs/backend-api.graphql"` in the backend folder)
2. Run "Generate GraphQL Flutter Client" (or first copy `backend/schema.graphql` to `frontend/schema.graphql` and 
   run ```flutter pub run build_runner build --delete-conflicting-outputs``` in the `frontend` directory
3. Run "Generate GraphQL React Client" (or `npm generate-graphql` in the `administration` directory)
