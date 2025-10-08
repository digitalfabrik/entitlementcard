package app.ehrenamtskarte.backend
import io.swagger.v3.oas.annotations.OpenAPIDefinition
import io.swagger.v3.oas.annotations.info.Info
import org.springframework.boot.autoconfigure.SpringBootApplication

@OpenAPIDefinition(
    info = Info(
        title = "Entitlementcard API",
        version = "1.0.0",
        description = "API documentation for the entitlementcard backend. " +
            "See https://github.com/entitlementcard/backend for more information.",
    ),
)
@SpringBootApplication
class BackendApplication
