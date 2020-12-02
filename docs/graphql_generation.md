# Code Generation for GraphQL

Files are generated into [frontend/lib/graphql](../frontend/lib/graphql).
Queries are specified in [frontend/graphql_queries](../frontend/graphql_queries).

## Generate API Files
1. If schema changed: Generate updated GraphQL schema into [schema.graphql](../frontend/schema.graphql)
   Run "Generate GraphQL" in Intellij (or ```./gradlew run --args="--export-api=../frontend/schema.graphql"``` in the backend folder)
2. In the frontend directory run ```flutter pub run build_runner build``` 
