import 'package:ehrenamtskarte/category_assets.dart';
import 'package:flutter/material.dart';
import 'package:tinycolor2/tinycolor2.dart';

Color getReadableOnColor(Color backgroundColor) {
  return backgroundColor.computeLuminance() > 0.5 ? Colors.black : Colors.white;
}

Color getReadableOnColorSecondary(Color backgroundColor) {
  return backgroundColor.computeLuminance() > 0.5 ? Colors.black54 : Colors.white54;
}

Color? getDarkenedColorForCategory(int categoryId) {
  final categoryColor = categoryAssets[categoryId].color;
  Color? categoryColorDark;
  if (categoryColor != null) {
    categoryColorDark = TinyColor(categoryColor).darken().color;
  }
  return categoryColorDark;
}
