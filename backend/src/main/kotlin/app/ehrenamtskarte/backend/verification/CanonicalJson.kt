package app.ehrenamtskarte.backend.verification

import com.google.protobuf.Descriptors
import com.google.protobuf.Descriptors.FieldDescriptor.Type
import com.google.protobuf.GeneratedMessageV3

class CanonicalJson {
    companion object {
        /**
         * Returns a canonical JSON object from the given protobuf message.
         * It asserts that
         * 1. the message does not have any unknown fields,
         * 2. every field in the message (and submessages, recursively) is marked as optional and thus has explicit presence,
         * 3. there are only singular enums, integers and submessages as fields (no maps or repeated fields).
         * For every present field in the message, we add an entry to the resulting object where the key is the tagNumber of the
         * field, and the value is the appropriately encoded JSON value.
         * Note, that we encode integers as strings because JSON-Number does not allow the full range of uint64 integers.
         */
        fun messageToMap(message: GeneratedMessageV3): Map<String, Any> {
            if (message.unknownFields.serializedSize > 0) {
                throw Error("Message has unknown fields. You might be running on an outdated proto definition.")
            }
            return message.allFields.entries.filter { it.value != null }.associate {
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
                    Descriptors.FieldDescriptor.Type.STRING, Descriptors.FieldDescriptor.Type.BOOL, Descriptors.FieldDescriptor.Type.SINT32, Descriptors.FieldDescriptor.Type.INT32, Descriptors.FieldDescriptor.Type.UINT32, Descriptors.FieldDescriptor.Type.UINT64 -> {
                        return@associate Pair(it.key.number.toString(), it.value.toString())
                    }
                    Descriptors.FieldDescriptor.Type.ENUM -> {
                        val enumValue = it.value
                        if (enumValue !is Descriptors.EnumValueDescriptor) {
                            throw Error("Field ${it.key.name} is not an instance of Enum despite its kind is 'enum'.")
                        }
                        return@associate Pair(it.key.number.toString(), enumValue.number.toString())
                    }
                    Descriptors.FieldDescriptor.Type.MESSAGE -> {
                        val subMessage = it.value
                        if (subMessage !is GeneratedMessageV3) {
                            throw Error("Field ${it.key.name} is not an instance of Message despite its kind is 'message'.")
                        }
                        return@associate Pair(it.key.number.toString(), messageToMap(subMessage))
                    }
                    else -> throw Error("Field ${it.key.name} has an unsupported type of ${it.key.type}")
                }
            }
        }

        fun serializeToString(message: GeneratedMessageV3): String {
            return serializeToString(messageToMap(message))
        }

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
    }
}
