# Code Generation for GraphQL

Files are generated into [frontend/lib/graphql](../frontend/lib/graphql).
Queries are specified in [frontend/graphql_queries](../frontend/graphql_queries).

## Generate API Files
1. If schema changed: Generate updated GraphQL schema into [graphql.schema.json](../frontend/graphql.schema.json)
    * Install JS GraphQL plugin for IntelliJ
    * Run backend
    * In GraphQL tab select: Endpoints -> Default -> Get GraphQL Schema from Endpoint
2. In the frontend directory run ```flutter pub run build_runner build``` 
