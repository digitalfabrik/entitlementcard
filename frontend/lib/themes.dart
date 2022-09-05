import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

ThemeData get lightTheme {
  const defaultTypography = Typography.blackMountainView;
  final lightTheme = ThemeData.from(
    colorScheme: const ColorScheme.light(
      primary: Color(0xff5f5384),
      secondary: Color(0xff5f5384),
    ),
    textTheme: defaultTypography.copyWith(
      headline4: defaultTypography.headline4?.apply(color: Colors.black87),
      headline5: defaultTypography.headline4?.apply(color: Colors.black87),
      headline6: const TextStyle(fontSize: 24.0, fontWeight: FontWeight.bold),
      bodyText1: const TextStyle(fontSize: 15.0, fontWeight: FontWeight.normal),
      bodyText2: const TextStyle(fontSize: 15.0, color: Color(0xFF505050)),
    ),
  );
  return lightTheme.copyWith(
    textSelectionTheme: const TextSelectionThemeData(
      selectionHandleColor: Colors.white,
      selectionColor: Color(0xFF505050),
    ),
    appBarTheme: AppBarTheme(
      systemOverlayStyle: SystemUiOverlayStyle.light,
      color: lightTheme.colorScheme.primary,
    ),
  );
}

ThemeData get darkTheme {
  const defaultTypography = Typography.whiteMountainView;
  final theme = ThemeData.from(
    colorScheme: const ColorScheme.dark(
      primary: Color(0xff8377A9),
      secondary: Color(0xff8377A9),
    ),
    textTheme: defaultTypography.copyWith(
      headline4: defaultTypography.headline4?.apply(color: Colors.white),
      headline5: defaultTypography.headline4?.apply(color: Colors.white),
      headline6: const TextStyle(fontSize: 24.0, fontWeight: FontWeight.bold),
      bodyText1: const TextStyle(fontSize: 15.0, fontWeight: FontWeight.normal),
      bodyText2: const TextStyle(fontSize: 15.0, color: Color(0xFFC6C4C4)),
    ),
  );
  return theme.copyWith(
    textSelectionTheme: const TextSelectionThemeData(
      selectionHandleColor: Colors.white,
      selectionColor: Color(0xFF505050),
    ),
    appBarTheme: AppBarTheme(systemOverlayStyle: SystemUiOverlayStyle.light, color: theme.colorScheme.primary),
  );
}
