# Working with the GraphQL API

> This article is about how to create your first query in the backend and use it in the web frontend.
> In this case you want to create a simple graphql query that fetches applications for a region.

1. Search for `EakApplicationQueryService (regions/webservice)`
2. Create a new function with a graphql description. Define the parameters that you need from the frontend in this case the `regionId`. Note that `DataFetchingEnvironment` provides some context from the graphQL payload and is always available.
3. Here you want to return a list of `ApplicationView`

Example:
```kotlin
    @GraphQLDescription("Queries all applications for a specific region")
    fun getApplications(dfe: DataFetchingEnvironment, regionId: Int): List<ApplicationView> {
        val context = dfe.graphQlContext.context
        val admin = context.getAuthContext().admin
    
        return transaction {
            if (!Authorizer.mayViewApplicationsInRegion(admin, regionId)) {
              throw ForbiddenException()
            }
            ApplicationRepository.getApplicationsByAdmin(regionId)
         }
    }

```
3. In this example we check if the requesting user is authorized. If you just want to check if the user is logged in, you can also use:
```kotlin
val jwtPayload = dfe.graphQlContext.context.enforceSignedIn()
```
4. Ensure wrapping your code in a `transaction {}` if you want to make any database interactions.
5. To ensure that we keep a clean structure, please keep all database interacting functions in the particular repositories. `(ApplicationRepository)`
6. Once your backend function is created you can run `Export GraphQL (runConfig/backend)`.
7. This will update the `backend-api.graphql` specs file `(/specs)`.
8. Check if your new query is listed there.
- Additional info: If you want to create a new service file, you also have to add it to the `ApplicationGraphQLParams.kt` in this case. Then it will be listed in the specs.
9. Now you can create you query file for the web frontend `getApplications.grapqhl (administration/src/graphql/applications)`

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
10. `applications: getApplications(regionId: $regionId)` is calling the backend function you created in step 3.
11. Define all properties of the list object that you need in curly braces.
12. Now you want to create the react hooks to interact with your query in the frontend.
13. Run `Generate Administration GraqhQl`.
14. Check the `graqhql.tsx` file if your hook was created `(useGetApplicationsQuery)`.
15. Before you can call a new query you have to restart the backend service to ensure that update schema was loaded.
16. Find an example how to use this hook in the `ApplicationsController.tsx`.
16. Note that the hooks always provide `onError` and `onComplete` functions were f.e. toasts can be shown to the user.
