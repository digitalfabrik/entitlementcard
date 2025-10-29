package app.ehrenamtskarte.backend
import io.swagger.v3.oas.annotations.OpenAPIDefinition
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType
import io.swagger.v3.oas.annotations.info.Info
import io.swagger.v3.oas.annotations.security.SecurityScheme
import org.springframework.boot.autoconfigure.SpringBootApplication

@OpenAPIDefinition(
    info = Info(
        title = "Entitlementcard API",
        version = BuildConfig.VERSION_NAME,
        description = "API documentation for the entitlementcard backend. " +
            "See https://github.com/digitalfabrik/entitlementcard/tree/main/backend/src/main/kotlin/app/ehrenamtskarte/backend/routes for more information.",
    ),
)
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
)
@SpringBootApplication
class BackendApplication
