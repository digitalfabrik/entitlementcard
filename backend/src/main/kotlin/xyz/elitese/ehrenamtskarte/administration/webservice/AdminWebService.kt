package xyz.elitese.ehrenamtskarte.administration.webservice

import io.javalin.Javalin
import io.javalin.plugin.openapi.OpenApiOptions
import io.javalin.plugin.openapi.OpenApiPlugin
import io.javalin.plugin.openapi.dsl.documented
import io.javalin.plugin.openapi.ui.SwaggerOptions
import io.swagger.v3.oas.models.info.Info

const val PORT = 7001

class AdminWebService {
    fun start() {
        val app = Javalin.create { cfg ->
            cfg.enableDevLogging()
            cfg.enableCorsForAllOrigins()
            cfg.registerPlugin(OpenApiPlugin(getOpenApiOptions()))
        }.start(PORT)

        println("Admin Server is running at http://localhost:${PORT}")

        val cardIssueHandler = CardIssueHandler()

        app.get("/card", documented(CardIssueHandler.getCardDocumentation) {
                ctx -> cardIssueHandler.handleCardIssueRequest(ctx)
        })
    }

    private fun getOpenApiOptions(): OpenApiOptions {
        val applicationInfo: Info = Info()
            .version("1.0")
            .description("EAK Administration Backend")
        return OpenApiOptions(applicationInfo)
            .path("/swagger-docs")
            .swagger(SwaggerOptions("/swagger").title("Swagger Docs"))
    }
}