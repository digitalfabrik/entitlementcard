package app.ehrenamtskarte.backend.util

import com.expediagroup.graphql.client.types.GraphQLClientRequest
import kotlin.reflect.KProperty1
import kotlin.reflect.KVisibility
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.declaredMembers

object GraphQLRequestSerializer {

    fun serializeMutation(request: GraphQLClientRequest<*>): String {
        return """
        mutation ${request.javaClass.simpleName} {
            ${request.operationName}(
                ${serializeObject(request.variables!!)}
            )
        }
        """.trimIndent()
    }

    private fun serializeObject(obj: Any): String {
        return obj::class.declaredMemberProperties.filter { it.visibility == KVisibility.PUBLIC }
            .joinToString(", ") { property ->
                val value = readInstanceProperty<Any>(obj, property.name)
                val serializedValue = "${property.name}: ${
                when (value) {
                    is String -> "\"$value\""
                    is Number, is Boolean -> value.toString()
                    is Enum<*> -> value.name
                    is List<*> -> serializeList(value)
                    null -> null
                    else -> "{ ${serializeObject(value)} }"
                }}"
                serializedValue
            }
    }

    private fun serializeList(list: List<*>): String? {
        if (list.isEmpty()) return null
        return list.joinToString(", ", "[", "]") { "{ ${serializeObject(it!!)}} " }
    }

    @Suppress("UNCHECKED_CAST")
    private fun <R> readInstanceProperty(instance: Any, propertyName: String): R? {
        val property = instance::class.declaredMembers.first { it.name == propertyName } as KProperty1<Any, *>
        return property.get(instance) as R?
    }
}
