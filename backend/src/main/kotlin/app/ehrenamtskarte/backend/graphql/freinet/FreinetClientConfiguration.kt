package app.ehrenamtskarte.backend.graphql.freinet

import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.plugins.HttpRequestRetry
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class FreinetClientConfiguration {
    @Bean
    fun freinetHttpClient(): HttpClient =
        HttpClient(CIO) {
            install(HttpRequestRetry) {
                retryOnServerErrors(maxRetries = 3)
                retryOnException(maxRetries = 3, retryOnTimeout = false)
                exponentialDelay()
            }
            expectSuccess = true
        }
}
