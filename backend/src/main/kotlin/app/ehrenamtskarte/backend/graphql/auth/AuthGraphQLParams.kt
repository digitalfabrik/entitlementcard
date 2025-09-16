package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.graphql.GraphQLParams
import app.ehrenamtskarte.backend.graphql.createRegistryFromNamedDataLoaders
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject

val authGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(
        supportedPackages = listOf("app.ehrenamtskarte.backend.graphql.auth.types"),
    ),
    dataLoaderRegistry = createRegistryFromNamedDataLoaders(administratorLoader),
    mutations = listOf(
        TopLevelObject(SignInMutationService()),
        TopLevelObject(ChangePasswordMutationService()),
        TopLevelObject(ResetPasswordMutationService()),
        TopLevelObject(ManageUsersMutationService()),
        TopLevelObject(NotificationSettingsMutationService()),
        TopLevelObject(ApiTokenService()),
    ),
    queries = listOf(
        TopLevelObject(ViewAdministratorsQueryService()),
        TopLevelObject(ResetPasswordQueryService()),
        TopLevelObject(NotificationSettingsQueryService()),
        TopLevelObject(ApiTokenQueryService()),
        TopLevelObject(ViewPepperQueryService()),
    ),
)
