package app.ehrenamtskarte.backend.graphql.shared.context

import graphql.schema.DataFetchingEnvironment
import org.springframework.core.MethodParameter
import org.springframework.graphql.data.method.HandlerMethodArgumentResolver
import org.springframework.stereotype.Component
import reactor.core.publisher.Mono

@Component
class ContextValueArgumentResolver : HandlerMethodArgumentResolver {
    override fun supportsParameter(parameter: MethodParameter): Boolean {
        return parameter.hasParameterAnnotation(GraphQLContext::class.java)
    }

    override fun resolveArgument(
        parameter: MethodParameter,
        environment: DataFetchingEnvironment
    ): Mono<Any?> {
        val value = environment.graphQlContext.get<Any>(parameter.parameterType.kotlin)
        return Mono.justOrEmpty(value)
    }
}
