package app.ehrenamtskarte.backend.verification

import com.google.protobuf.Descriptors
import com.google.protobuf.Descriptors.FieldDescriptor.Type
import com.google.protobuf.GeneratedMessageV3
import kotlin.math.pow

class CanonicalJson {
    companion object {
        private val highestSafeInt = 2.0.pow(53) - 1
        private val lowestSafeInt = -highestSafeInt

        private fun GeneratedMessageV3.assertOnlyKnownFields() {
            if (this.unknownFields.serializedSize > 0) {
                throw Error("Message has unknown fields. You might be running on an outdated proto definition.")
            }
        }

        private fun GeneratedMessageV3.assertOnlyOptionalFields() {
            this.allFields.forEach {
                if (!it.key.isOptional) {
                    throw Error(
                        """
                    Field ${it.key.name} is not optional, although we only allow optional fields.
                    Note that, 'optional' in proto3 only means explicit presence, i.e. it can be determined if a field marked
                    as optional is actually present in an instance of a proto. Using only fields with explicit presence
                    enables us to remove fields from the proto in the future.
                        """.trimIndent()
                    )
                }
            }
        }

        private fun GeneratedMessageV3.assertNoRepeatedFields() {
            this.allFields.forEach {
                if (it.key.isRepeated) {
                    // If we want to support repeated fields in the future, we should probably do the following to avoid breaking
                    // older protos without the field:
                    // If the repeated field is empty (if there are no elements "in the array"), do not emit anything in the JSON.
                    // If there is at least one field, emit a JSON Array by mapping each element to its JSON equivalent (see below).
                    throw Error("Repeated fields are currently not supported.")
                }
            }
        }

        private fun GeneratedMessageV3.assertMessageIsValid() {
            assertOnlyKnownFields()
            assertOnlyOptionalFields()
            assertNoRepeatedFields()
        }

        /**
         * Returns a canonical JSON object from the given protobuf message.
         * For every present field in the message, we add an entry to the resulting object where the key is the tagNumber of the
         * field, and the value is the appropriately encoded JSON value.
         * Note, that we encode integers as strings because JSON-Number does not allow the full range of uint64 integers.
         */
        fun messageToMap(message: GeneratedMessageV3): Map<String, Any> {
            message.assertMessageIsValid()

            return message.allFields.entries.filter { it.value != null }.associate {
                return@associate when (it.key.type) {
                    Type.STRING, Type.BOOL, Type.SINT32, Type.INT32, Type.UINT32, Type.UINT64 -> Pair(
                        it.key.number.toString(),
                        it.value.toString()
                    )

                    Type.ENUM -> {
                        val enumValue = it.value
                        if (enumValue !is Descriptors.EnumValueDescriptor) {
                            throw Error("Field ${it.key.name} is not an instance of Enum despite its kind is 'enum'.")
                        }
                        Pair(it.key.number.toString(), enumValue.number.toString())
                    }

                    Type.MESSAGE -> {
                        val subMessage = it.value
                        if (subMessage !is GeneratedMessageV3) {
                            throw Error("Field ${it.key.name} is not an instance of Message despite its kind is 'message'.")
                        }
                        Pair(it.key.number.toString(), messageToMap(subMessage))
                    }

                    else -> throw Error("Field ${it.key.name} has an unsupported type of ${it.key.type}")
                }
            }
        }

        fun serializeToString(message: GeneratedMessageV3) = serializeToString(messageToMap(message))
        private fun Int.isSafeInteger() = this >= lowestSafeInt && this <= highestSafeInt

        fun serializeToString(o: Any?): String {
            return when (o) {
                null -> "null"
                is String -> "\"${o}\""
                is Boolean -> o.toString()
                is Int -> if (o.isSafeInteger()) o.toString() else throw Error("Number cannot safely parsed to JS Integer")
                is Collection<*> -> o.joinToString(",", "[", "]") { serializeToString(it) }
                is Map<*, *> -> {
                    o.mapKeys { it.key.toString() }.toSortedMap(Comparator.naturalOrder()).entries.map {
                        return@map "\"${it.key}\":${serializeToString(it.value)}"
                    }.joinToString(",", "{", "}")
                }

                else -> throw Error("Invalid argument of type ${o::class.simpleName} passed to serializeToCanonicalJson.")
            }
        }
    }
}
