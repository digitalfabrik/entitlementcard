package app.ehrenamtskarte.backend.cards

import app.ehrenamtskarte.backend.userdata.KoblenzUser
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.google.protobuf.Descriptors
import com.google.protobuf.Descriptors.FieldDescriptor.Type
import com.google.protobuf.GeneratedMessage
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.JsonNull
import kotlinx.serialization.json.JsonPrimitive
import kotlinx.serialization.json.buildJsonArray
import kotlinx.serialization.json.buildJsonObject
import kotlin.math.pow

class CanonicalJson {
    companion object {
        private fun GeneratedMessage.assertOnlyKnownFields() {
            if (this.unknownFields.serializedSize > 0) {
                throw Error("Message has unknown fields. You might be running on an outdated proto definition.")
            }
        }

        private fun GeneratedMessage.assertOnlyOptionalFields() {
            this.allFields.forEach {
                if (it.key.run { isRequired() || isRepeated() }) {
                    throw Error(
                        """
                    Field ${it.key.name} is not optional, although we only allow optional fields.
                    Note that, 'optional' in proto3 only means explicit presence, i.e. it can be determined if a field marked
                    as optional is actually present in an instance of a proto. Using only fields with explicit presence
                    enables us to remove fields from the proto in the future.
                        """.trimIndent(),
                    )
                }
            }
        }

        private fun GeneratedMessage.assertNoRepeatedFields() {
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

        private fun GeneratedMessage.assertMessageIsValid() {
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
        fun messageToMap(message: GeneratedMessage): Map<String, Any> {
            message.assertMessageIsValid()

            return message.allFields.entries.filter { it.value != null }.associate {
                return@associate when (it.key.type) {
                    Type.STRING, Type.BOOL, Type.SINT32, Type.INT32, Type.UINT32, Type.UINT64 -> Pair(
                        it.key.number.toString(),
                        it.value.toString(),
                    )

                    Type.ENUM -> {
                        val enumValue = it.value
                        if (enumValue !is Descriptors.EnumValueDescriptor) {
                            throw Error(
                                "Field ${it.key.name} is not an instance of Enum despite its kind is 'enum'.",
                            )
                        }
                        Pair(it.key.number.toString(), enumValue.number.toString())
                    }

                    Type.MESSAGE -> {
                        val subMessage = it.value
                        if (subMessage !is GeneratedMessage) {
                            throw Error(
                                "Field ${it.key.name} is not an instance of Message despite its kind is 'message'.",
                            )
                        }
                        Pair(it.key.number.toString(), messageToMap(subMessage))
                    }

                    else -> throw Error(
                        "Field ${it.key.name} has an unsupported type of ${it.key.type}",
                    )
                }
            }
        }

        fun koblenzUserToString(koblenzUser: KoblenzUser): String {
            val map = ObjectMapper().convertValue(
                koblenzUser,
                object : TypeReference<Map<String, Any>>() {},
            )
            return serializeToString(map)
        }

        fun serializeToString(message: GeneratedMessage) = serializeToString(messageToMap(message))

        /**
         * Kotlin's implementation of JavaScript [Number.isSafeInteger()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger)
         * @return true if this is in (-(2^53 - 1), 2^53 - 1)
         */
        private fun Int.isSafeInteger(): Boolean {
            val highestSafeInt = 2.0.pow(53) - 1
            val lowestSafeInt = -highestSafeInt
            return this >= lowestSafeInt && this <= highestSafeInt
        }

        /**
         * Taken & adjusted from https://github.com/erdtman/canonicalize/blob/HEAD/lib/canonicalize.js
         * Under Apache 2.0 License
         *
         * @param o one of null, any primitive kotlin object, a collection, or a map
         * @return A serialization of the passed object according to [RFC 8785 JSON Canonicalization Scheme (JCS)](https://www.rfc-editor.org/rfc/rfc8785).
         * @throws Error if a non JSON serializable object is passed to the function (instead of returning undefined).
         * Especially, in the case of NaN or infinite number values.
         */
        fun serializeToString(o: Any?): String {
            fun buildJson(json: Any?): JsonElement =
                when (json) {
                    null -> JsonNull
                    is String -> JsonPrimitive(json)
                    is Boolean -> JsonPrimitive(json)
                    is Int -> if (json.isSafeInteger()) {
                        JsonPrimitive(json)
                    } else {
                        throw Error("Number cannot safely parsed to JS Integer")
                    }
                    is Collection<*> -> buildJsonArray { json.forEach { add(buildJson(it)) } }
                    is Map<*, *> -> {
                        buildJsonObject {
                            json.mapKeys {
                                val key = it.key
                                if (key !is String) throw Error("Map key should be of type String.")
                                key
                            }.toSortedMap(Comparator.naturalOrder()).forEach { (key, value) ->
                                put(key, buildJson(value))
                            }
                        }
                    }

                    else -> throw Error(
                        "Invalid argument of type ${json::class.simpleName} passed to serializeToCanonicalJson.",
                    )
                }
            return buildJson(o).toString()
        }
    }
}
