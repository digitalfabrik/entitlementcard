import 'dart:collection';
import 'package:protobuf/protobuf.dart';

extension CanonicalJson on GeneratedMessage {
  Map<String, dynamic> toCanonicalJsonObject() {
    if (unknownFields.isNotEmpty) throw ArgumentError("Unknown field");
    final map = HashMap<String, dynamic>();
    for (final field in info_.fieldInfo.values) {
      if (field.isRepeated) {
        throw ArgumentError("Repeated fields are currently not supported.");
      } else if (field.isMapField) {
        throw ArgumentError("Map fields are currently not supported.");
      }

      // Ideally, we would check that we do not access fields without explicit presence (and throw in this case).
      // This is currently not supported by protobuf.dart (see https://github.com/google/protobuf.dart/issues/801).
      // However, for the Flutter frontend, this is not critical, as we do not generate hashes based on (in this case)
      // faulty protobuf definitions and store them in the DB.

      final dynamic value = getFieldOrNull(field.tagNumber);
      if (value == null) {
        continue;
      } else if (value is String) {
        map[field.tagNumber.toString()] = value;
      } else if (value is int) {
        map[field.tagNumber.toString()] = value.toString();
      } else if (value is ProtobufEnum) {
        map[field.tagNumber.toString()] = value.value.toString();
      } else if (value is GeneratedMessage) {
        map[field.tagNumber.toString()] = value.toCanonicalJsonObject();
      } else {
        throw ArgumentError("Could not detect type of field.");
      }
    }
    return map;
  }
}
