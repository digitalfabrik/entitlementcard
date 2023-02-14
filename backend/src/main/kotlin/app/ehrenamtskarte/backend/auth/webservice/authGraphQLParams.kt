package app.ehrenamtskarte.backend.auth.webservice

import app.ehrenamtskarte.backend.auth.webservice.dataloader.ADMINISTRATOR_LOADER_NAME
import app.ehrenamtskarte.backend.auth.webservice.dataloader.administratorLoader
import app.ehrenamtskarte.backend.auth.webservice.schema.ChangePasswordMutationService
import app.ehrenamtskarte.backend.auth.webservice.schema.ManageUsersMutationService
import app.ehrenamtskarte.backend.auth.webservice.schema.ResetPasswordMutationService
import app.ehrenamtskarte.backend.auth.webservice.schema.SignInMutationService
import app.ehrenamtskarte.backend.auth.webservice.schema.ViewAdministratorsQueryService
import app.ehrenamtskarte.backend.common.webservice.GraphQLParams
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject
import org.dataloader.DataLoaderRegistry

private fun createDataLoaderRegistry(): DataLoaderRegistry {
    val dataLoader = DataLoaderRegistry()
    dataLoader.register(ADMINISTRATOR_LOADER_NAME, administratorLoader)
    return dataLoader
}

val authGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(supportedPackages = listOf("app.ehrenamtskarte.backend.auth.webservice.schema")),
    dataLoaderRegistry = createDataLoaderRegistry(),
    mutations = listOf(
        TopLevelObject(SignInMutationService()),
        TopLevelObject(ChangePasswordMutationService()),
        TopLevelObject(ResetPasswordMutationService()),
        TopLevelObject(ManageUsersMutationService())
    ),
    queries = listOf(
        TopLevelObject(ViewAdministratorsQueryService())
    )
)
