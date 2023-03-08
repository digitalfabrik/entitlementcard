package app.ehrenamtskarte.backend.auth.webservice

import app.ehrenamtskarte.backend.auth.webservice.dataloader.administratorLoader
import app.ehrenamtskarte.backend.auth.webservice.schema.ChangePasswordMutationService
import app.ehrenamtskarte.backend.auth.webservice.schema.ManageUsersMutationService
import app.ehrenamtskarte.backend.auth.webservice.schema.ResetPasswordMutationService
import app.ehrenamtskarte.backend.auth.webservice.schema.SignInMutationService
import app.ehrenamtskarte.backend.auth.webservice.schema.ViewAdministratorsQueryService
import app.ehrenamtskarte.backend.common.webservice.GraphQLParams
import app.ehrenamtskarte.backend.common.webservice.createRegistryFromNamedDataLoaders
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject

val authGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(supportedPackages = listOf("app.ehrenamtskarte.backend.auth.webservice.schema")),
    dataLoaderRegistry = createRegistryFromNamedDataLoaders(administratorLoader),
    mutations = listOf(
        TopLevelObject(SignInMutationService()),
        TopLevelObject(ChangePasswordMutationService()),
        TopLevelObject(ResetPasswordMutationService()),
        TopLevelObject(ManageUsersMutationService()),
    ),
    queries = listOf(
        TopLevelObject(ViewAdministratorsQueryService()),
    ),
)
