package app.ehrenamtskarte.backend.verification

import com.google.protobuf.Descriptors
import com.google.protobuf.Descriptors.EnumValueDescriptor
import com.google.protobuf.GeneratedMessageV3

class CardInfoHash {
    companion object {
        fun toMap(message: GeneratedMessageV3): Map<String, Any> {
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
                        if (enumValue !is EnumValueDescriptor) {
                            throw Error("Field ${it.key.name} is not an instance of Enum despite its kind is 'enum'.")
                        }
                        return@associate Pair(it.key.number.toString(), enumValue.number.toString())
                    }
                    Descriptors.FieldDescriptor.Type.MESSAGE -> {
                        val subMessage = it.value
                        if (subMessage !is GeneratedMessageV3) {
                            throw Error("Field ${it.key.name} is not an instance of Message despite its kind is 'message'.")
                        }
                        return@associate Pair(it.key.number.toString(), toMap(subMessage))
                    }
                    else -> throw Error("Field ${it.key.name} has an unsupported type of ${it.key.type}")
                }
            }
        }
    }
}
