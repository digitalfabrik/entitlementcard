package app.ehrenamtskarte.backend.graphql.auth

import app.ehrenamtskarte.backend.graphql.GraphQLParams
import com.expediagroup.graphql.generator.SchemaGeneratorConfig
import com.expediagroup.graphql.generator.TopLevelObject
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class AuthGraphQLConfiguration {
    @Bean
    fun authGraphQlParams(
        signInMutationController: SignInMutationController,
        viewAdministratorsQueryController: ViewAdministratorsQueryController,
        changePasswordMutationController: ChangePasswordMutationController,
        resetPasswordMutationController: ResetPasswordMutationController,
        resetPasswordQueryController: ResetPasswordQueryController,
        viewPepperQueryController: ViewPepperQueryController,
        apiTokenController: ApiTokenController,
        apiTokenQueryController: ApiTokenQueryController,
        manageUsersMutationController: ManageUsersMutationController,
        notificationSettingsMutationController: NotificationSettingsMutationController,
        notificationSettingsQueryController: NotificationSettingsQueryController,
    ): GraphQLParams =
        GraphQLParams(
            config = SchemaGeneratorConfig(
                supportedPackages = listOf("app.ehrenamtskarte.backend.graphql.auth.types"),
            ),
            mutations = listOf(
                TopLevelObject(signInMutationController),
                TopLevelObject(changePasswordMutationController),
                TopLevelObject(resetPasswordMutationController),
                TopLevelObject(manageUsersMutationController),
                TopLevelObject(notificationSettingsMutationController),
                TopLevelObject(apiTokenController),
            ),
            queries = listOf(
                TopLevelObject(viewAdministratorsQueryController),
                TopLevelObject(resetPasswordQueryController),
                TopLevelObject(notificationSettingsQueryController),
                TopLevelObject(apiTokenQueryController),
                TopLevelObject(viewPepperQueryController),
            ),
        )
}
