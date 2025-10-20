package app.ehrenamtskarte.backend.graphql.application.multipart

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.annotation.Order
import org.springframework.graphql.server.WebGraphQlHandler
import org.springframework.http.MediaType.MULTIPART_FORM_DATA
import org.springframework.web.servlet.function.RouterFunction
import org.springframework.web.servlet.function.ServerResponse
import org.springframework.web.servlet.function.router

@Configuration
class MultipartGraphQLConfiguration {
    /**
     * Creates a router function to handle multipart/form-data requests for the GraphQL endpoint
     */
    @Bean
    @Order(-10)
    fun graphQlMultipartRouter(handler: WebGraphQlHandler): RouterFunction<ServerResponse> =
        router {
            val multipartHandler = MultipartGraphQLHandler(handler)
            POST("/")
                .and(contentType(MULTIPART_FORM_DATA))
                .invoke(multipartHandler::handleMultipartRequest)
        }
}
