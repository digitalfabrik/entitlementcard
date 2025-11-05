package app.ehrenamtskarte.backend.graphql.application.multipart

import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.annotation.Order
import org.springframework.graphql.server.webflux.GraphQlHttpHandler
import org.springframework.http.MediaType.MULTIPART_FORM_DATA
import org.springframework.web.reactive.function.server.RouterFunction
import org.springframework.web.reactive.function.server.ServerResponse
import org.springframework.web.reactive.function.server.coRouter
import org.springframework.web.reactive.function.server.router

@Configuration
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.REACTIVE)
class MultipartGraphQLConfiguration {
    /**
     * Creates a router function to handle multipart/form-data requests for the GraphQL endpoint
     */
    @Bean
    @Order(-10)
    fun graphQlMultipartRouter(handler: GraphQlHttpHandler): RouterFunction<ServerResponse> =
        coRouter {
            val multipartHandler = MultipartGraphQLHandler(handler)

            POST("/")
                .and(contentType(MULTIPART_FORM_DATA))
                .invoke(multipartHandler::handleMultipartRequest)
        }
}
