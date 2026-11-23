import 'package:flutter/material.dart';

Color getReadableOnColor(Color backgroundColor) {
  return backgroundColor.computeLuminance() > 0.5 ? Colors.black : Colors.white;
}

Color getReadableOnColorSecondary(Color backgroundColor) {
  return backgroundColor.computeLuminance() > 0.5 ? Colors.black54 : Colors.white54;
}

Color getColorFromHex(String hexColor) {
  final hexCode = hexColor.replaceAll('#', '');
  return Color(int.parse('FF$hexCode', radix: 16));
}
