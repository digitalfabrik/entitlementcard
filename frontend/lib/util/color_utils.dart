import 'package:ehrenamtskarte/category_assets.dart';
import 'package:flutter/material.dart';
import 'package:tinycolor2/tinycolor2.dart';

Color getReadableOnColor(Color backgroundColor) {
  return backgroundColor.computeLuminance() > 0.5 ? Colors.black : Colors.white;
}

Color getReadableOnColorSecondary(Color backgroundColor) {
  return backgroundColor.computeLuminance() > 0.5 ? Colors.black54 : Colors.white54;
}

Color? getDarkenedColorForCategory(BuildContext context, int categoryId) {
  final categoryColor = categoryAssets(context)[categoryId].color;
  Color? categoryColorDark;
  if (categoryColor != null) {
    categoryColorDark = TinyColor.fromColor(categoryColor).darken().color;
  }
  return categoryColorDark;
}

Color getColorFromHex(String hexColor) {
  final hexCode = hexColor.replaceAll('#', '');
  return Color(int.parse('FF$hexCode', radix: 16));
}
