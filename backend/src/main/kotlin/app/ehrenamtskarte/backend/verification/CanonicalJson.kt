package app.ehrenamtskarte.backend.verification

import com.google.protobuf.Descriptors.FieldDescriptor.Type
import com.google.protobuf.GeneratedMessageV3
import java.util.Objects

class CanonicalJson {
    companion object {
        fun serializeToString(o: Any?): String {
            if (o == null) {
                return "null"
            }
            when (o) {
                is String -> return "\"${o}\""
                is Boolean, is Int -> return o.toString()
                is Float -> return if (o.isFinite()) o.toString() else throw Error("Number with value $o cannot be passed to serializeToCanonicalJson.")
                is Double -> return if (o.isFinite()) o.toString() else throw Error("Number with value $o cannot be passed to serializeToCanonicalJson.")
                is Map<*, *> -> {
                    return o.mapKeys { it.key.toString() }.toSortedMap(Comparator.naturalOrder()).entries.map {
                        return@map "\"${it.key}\":${serializeToString(it.value)}"
                    }.joinToString(",", "{", "}")
                }

                is Collection<*> -> {
                    return o.joinToString(",", "[", "]") {
                        serializeToString(it)
                    }
                }

                else -> throw Error("Invalid argument of type ${o::class.simpleName} passed to serializeToCanonicalJson.")
            }
        }

        fun serialize(message: GeneratedMessageV3): String {
            return message.allFields.entries.map {
                if (!it.key.isOptional) {
                    throw Error(
                        """
                    Field ${it.key.name} is not optional, although we only allow optional fields.
                    Note that, 'optional' in proto3 only means explicit presence, i.e. it can be determined if a field marked
                    as optional is actually present in an instance of a proto. Using only fields with explicit presence
                    enables us to remove fields from the proto in the future."""
                    )
                }
                if (it.key.isRepeated) {
                    // If we want to support repeated fields in the future, we should probably do the following to avoid breaking
                    // older protos without the field:
                    // If the repeated field is empty (if there are no elements "in the array"), do not emit anything in the JSON.
                    // If there is at least one field, emit a JSON Array by mapping each element to its JSON equivalent (see below).
                    throw Error("Repeated fields are currently not supported.")
                }
                when (it.key.type) {
                    Type.STRING, Type.BOOL, Type.SINT32, Type.INT32, Type.UINT32, Type.UINT64, Type.ENUM -> {
                        if (it.value == null) {
                            return@map null
                        }
                        return@map "${it.key}:${it.value}"
                    }

                    Type.MESSAGE -> {
                        val subMessage = it.value ?: return@map null
                        if (subMessage !is GeneratedMessageV3) {
                            throw Error("Field ${it.key.name} is not an instance of Message despite its kind is 'message'.")
                        }
                        return@map "${it.key}:${serialize(subMessage)}"
                    }

                    else -> throw Error("Field ${it.key.name} has an unsupported type of ${it.key.type}")
                }
            }.filter(Objects::nonNull).joinToString(",")
        }
    }
}
