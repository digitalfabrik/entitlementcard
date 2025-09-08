package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.graphql.auth.dataloader.administratorLoader
import app.ehrenamtskarte.backend.graphql.auth.schema.ApiTokenQueryService
import app.ehrenamtskarte.backend.graphql.auth.schema.ApiTokenService
import app.ehrenamtskarte.backend.graphql.auth.schema.ChangePasswordMutationService
import app.ehrenamtskarte.backend.graphql.auth.schema.ManageUsersMutationService
import app.ehrenamtskarte.backend.graphql.auth.schema.NotificationSettingsMutationService
import app.ehrenamtskarte.backend.graphql.auth.schema.NotificationSettingsQueryService
import app.ehrenamtskarte.backend.graphql.auth.schema.ResetPasswordMutationService
import app.ehrenamtskarte.backend.graphql.auth.schema.ResetPasswordQueryService
import app.ehrenamtskarte.backend.graphql.auth.schema.SignInMutationService
import app.ehrenamtskarte.backend.graphql.auth.schema.ViewAdministratorsQueryService
import app.ehrenamtskarte.backend.graphql.auth.schema.ViewPepperQueryService
import app.ehrenamtskarte.backend.graphql.shared.GraphQLParams
import app.ehrenamtskarte.backend.graphql.shared.createRegistryFromNamedDataLoaders
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject

val authGraphQlParams = GraphQLParams(
    config = SchemaGeneratorConfig(
        supportedPackages = listOf("app.ehrenamtskarte.backend.graphql.auth.schema"),
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
