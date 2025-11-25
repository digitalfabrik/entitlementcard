# Working with the GraphQL API

This document outlines the process of adding or modifying GraphQL queries and mutations. Our project follows a **code-first approach**, where the GraphQL schema is generated directly from the server-side Kotlin code. This ensures that the API implementation and its specification are always in sync.

## Overall Workflow

The development workflow for our GraphQL API is as follows:

1.  **Server-Side Definition**: You define or modify queries and mutations directly in the Spring Boot controller classes. This code is the single source of truth for the API's structure and behavior.
2.  **Schema Generation**: After changing the server code, you run configuration (`Generate GraphQL specs`) that inspects the controllers and generates the `backend-api.graphql` schema file located in the `/specs` directory. This file represents the complete API specification.
3.  **Client-Side Generation**: The generated `backend-api.graphql` file is used by our frontend applications to generate type-safe client code.
    *   For the **administration module (React)**, this generates React hooks (e.g., `useGetApplicationsQuery`).
    *   For the **mobile apps (Flutter)**, this generates the necessary Dart classes for queries and mutations.

---

## Step-by-Step Guide: Creating a New Query

This guide walks you through creating a simple GraphQL query to fetch applications for a specific region.

### Part 1: Backend (Server-Side)

1. **Locate the correct controller**

In Spring Boot, all GraphQL queries and mutations are handled in controller classes annotated with `@Controller`. 
For application-related queries, you would look for `EakApplicationQueryController`.

```kotlin
@Controller
class EakApplicationQueryController
```

2. **Create a new query function**

Each query function must be annotated with `@QueryMapping` (or `@MutationMapping` for mutations).
Use `@GraphQLDescription` to describe what the function does.

3. **Define parameters**

* Include the parameters you need from the frontend. In this example, `regionId`.
* Each parameter should be annotated with `@Argument`.
* `DataFetchingEnvironment` is always available and provides the request context (e.g., the logged-in user).

4. **Implement the logic and return the result**

* Use `dfe.requireAuthContext()` to get the AuthContext. This will throw an `UnauthorizedException` if the user is not properly authenticated (e.g., the JWT is missing or the admin not found in the database).
* Check the user's permissions (e.g., `admin.mayViewApplicationsInRegion(regionId)`).
* Wrap any database interactions in a `transaction {}` block.
* To maintain a clean architecture, place database-specific logic in a corresponding repository (e.g., `ApplicationRepository`).

Here is a complete example:

```kotlin
@GraphQLDescription("Queries all applications for a specific region")
@QueryMapping
fun getApplications(@Argument regionId: Int, dfe: DataFetchingEnvironment): List<ApplicationAdminGql> { 
    val admin = dfe.requireAuthContext().admin
    return transaction {
       if (admin.mayViewApplicationsInRegion(regionId)) {
           ApplicationRepository.getApplicationsByAdmin(regionId)
               .map { ApplicationAdminGql.fromDbEntity(it) }
       } else {
           throw ForbiddenException()
       }
   }
}
```
5. **Generate the GraphQL Schema**

* Once your backend function is created, run the (`Generate GraphQL specs`) run configuration in your IDE. 
* This will update the `backend-api.graphql` file in the `(/specs)` directory. 
* Check that your new query is listed there.

6. **Restart the Backend**

Before generating frontend code, restart the backend service to ensure it's serving the updated schema.

### Part 2: Frontend (Client-Side)

This example focuses on the administration frontend (React).

1. **Create a new query file**

In the administration module, create a new `.graphql` file that defines the query you want to execute. 
For example, `getApplications.graphql` inside `administration/src/graphql/applications`.

```
query getApplications($regionId: Int!) {
  applications: getApplications(regionId: $regionId) {
    id
    createdDate
    jsonValue
    note
    cardCreated
    statusResolvedDate
    verifications {
      contactEmailAddress
      organizationName
      verifiedDate
      rejectedDate
    }
  }
}
```
* `applications: getApplications(regionId: $regionId)` calls the backend function you created. The `applications:` part is an alias for the result.
* Define all the properties of the returned object that you need in the frontend.

2. **Generate the React Hook**

Run the `Generate Administration GraphQL` run configuration. This will parse your `.graphql` file and generate a corresponding React hook (e.g., `useGetApplicationsQuery`) in the `graphql.tsx` file.

3. **Use the Hook in Your Component**

You can now import and use this hook in your React components. 
The hooks provide data, loading, and error states, as well as `onError` and `onComplete` callbacks for handling side effects like showing toasts. 
You can find examples of how to use these hooks in files like `ApplicationsController.tsx`.
