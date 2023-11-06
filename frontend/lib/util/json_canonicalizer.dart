import 'dart:convert';

/// Adjusted from https://github.com/aps-lab/jcs_dart/blob/master/lib/src/jcs_dart_base.dart
/// Under Apache 2.0 License
class JsonCanonicalizer {
  /// Returns a serialization of the passed object according to RFC 8785 JSON Canonicalization Scheme (JCS).
  ///
  /// Modifications compared to https://github.com/aps-lab/jcs_dart/blob/master/lib/src/jcs_dart_base.dart:
  /// 1) Throw, if we cannot serialize the object (instead of returning an empty string).
  String canonicalize(Object? jsonObject) {
    final stringBuffer = StringBuffer();
    _serialize(jsonObject, stringBuffer);
    return stringBuffer.toString();
  }

  void _serialize(Object? jsonObject, StringBuffer stringBuffer) {
    if (jsonObject == null || jsonObject is num || jsonObject is bool || jsonObject is String) {
      // Primitive type
      stringBuffer.write(json.encode(jsonObject));
    } else if (jsonObject is List) {
      // Array - Maintain element order
      stringBuffer.write('[');
      var next = false;
      for (final element in jsonObject) {
        if (next) {
          stringBuffer.write(',');
        }
        next = true;
        // Array element - Recursive expansion
        _serialize(element, stringBuffer);
      }
      stringBuffer.write(']');
    } else if (jsonObject is Map) {
      // Object - Sort properties before serializing
      stringBuffer.write('{');
      var next = false;
      final keys = List<String>.from(jsonObject.keys);
      keys.sort();
      for (final element in keys) {
        if (next) {
          stringBuffer.write(',');
        }
        next = true;
        // Property names are strings - Use ES6/JSON
        stringBuffer.write(json.encode(element));
        stringBuffer.write(':');
        // Property value - Recursive expansion
        _serialize(jsonObject[element], stringBuffer);
      }
      stringBuffer.write('}');
    } else {
      throw ArgumentError('Could not serialize value "$jsonObject"!');
    }
  }
}
