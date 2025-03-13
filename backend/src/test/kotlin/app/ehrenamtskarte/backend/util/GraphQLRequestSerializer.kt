package app.ehrenamtskarte.backend.util

import kotlin.reflect.KVisibility
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.memberProperties

object GraphQLRequestSerializer {

    /**
     * Serialize object into graphql request format
     * e.g. { stringProperty: "value", intProperty: 123, objectProperty: { booleanProperty: true } }
     */
    fun serializeObject(obj: Any): String {
        return obj::class.declaredMemberProperties.filter { it.visibility == KVisibility.PUBLIC }
            .joinToString(", ") { property ->
                val value = readInstanceField<Any>(obj, property.name)
                val serializedValue = "${property.name}: ${
                when (value) {
                    is String -> "\"$value\""
                    is Number, is Boolean -> value.toString()
                    is Enum<*> -> value.name
                    is List<*> -> serializeList(value)
                    null -> null
                    else -> serializeObject(value)
                }
                }"
                serializedValue
            }.let { "{ $it }" }
    }

    private fun serializeList(list: List<*>): String? {
        if (list.isEmpty()) return null
        return list.joinToString(", ", "[", "]") { serializeObject(it!!) }
    }

    @Suppress("UNCHECKED_CAST")
    private fun <R> readInstanceField(instance: Any, fieldName: String): R? {
        val field = instance::class.memberProperties.find { it.name == fieldName }
        return field?.getter?.call(instance) as R?

//        val property = instance::class.declaredMembers.first { it.name == fieldName } as KProperty1<Any, *>
//        return property.get(instance) as R?
    }
}
