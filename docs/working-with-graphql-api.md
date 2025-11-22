# Working with the GraphQL API

> This article is about how to create your first query in the backend and use it in the web frontend.
> In this case you want to create a simple graphql query that fetches applications for a region.

1. Search for `EakApplicationQueryController`
   
In Spring Boot, all GraphQL queries and mutations are handled in a controller class annotated with `@Controller`:
```kotlin
@Controller
class EakApplicationQueryController
```

2. Create a new GraphQL function

Each query function should be annotated with `@QueryMapping` (or `@MutationMapping` for mutations).
Use `@GraphQLDescription` to describe what the function does.

3. Define the parameters

* Include the parameters you need from the frontend. In this example, `regionId`.
* Each parameter should be annotated with `@Argument`.
* `DataFetchingEnvironment` is always available and provides the request context (e.g., the logged-in user).

4. Return the result

The function returns a list of `ApplicationAdminGql` objects:
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

5. Verify that the user is logged in (when applicable)

* Use `dfe.requireAuthContext()` to get the AuthContext from the GraphQL context. This provides information about the authenticated user.
* If no user is found (e.g., the JWT is missing or the admin not found in the database), it throws `UnauthorizedException`.

6. Ensure wrapping your code in a `transaction {}` if you want to make any database interactions.
7. To ensure that we keep a clean structure, please keep all database interacting functions in the particular repositories. `(ApplicationRepository)`
8. Once your backend function is created you can run `Generate GraphQL specs (runConfig/backend)`.
9. This will update the `backend-api.graphql` specs file `(/specs)`.
10. Check if your new query is listed there.
11. Now you can create you query file for the web frontend `getApplications.grapqhl (administration/src/graphql/applications)`

Example:
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
12. `applications: getApplications(regionId: $regionId)` is calling the backend function you created in step 3.
13. Define all properties of the list object that you need in curly braces.
14. Now you want to create the react hooks to interact with your query in the frontend.
15. Run `Generate Administration GraqhQl`.
16. Check the `graqhql.tsx` file if your hook was created `(useGetApplicationsQuery)`.
17. Before you can call a new query you have to restart the backend service to ensure that update schema was loaded.
18. Find an example how to use this hook in the `ApplicationsController.tsx`.
19. Note that the hooks always provide `onError` and `onComplete` functions were f.e. toasts can be shown to the user.
