import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/util/color_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

ThemeData get lightTheme {
  final defaultTypography = Typography.blackMountainView;
  final primaryColor = getColorFromHex(buildConfig.theme.primaryLight);
  final lightTheme = ThemeData(
    fontFamily: buildConfig.theme.fontFamily,
    colorScheme: ColorScheme.light(
      primary: primaryColor,
      secondary: primaryColor,
      background: Colors.white,
      surfaceVariant: const Color(0xffefefef),
      error: const Color(0xffcc0000),
      tertiary: const Color(0xFF505050),
    ),
    textTheme: defaultTypography.copyWith(
      headlineSmall: defaultTypography.headlineSmall?.apply(color: Colors.black87),
      titleLarge: const TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold),
      titleMedium: const TextStyle(fontSize: 18.0, fontWeight: FontWeight.bold),
      titleSmall: const TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
      bodyLarge: const TextStyle(fontSize: 15.0, fontWeight: FontWeight.normal),
      bodyMedium: const TextStyle(fontSize: 14.0, fontWeight: FontWeight.normal),
      bodySmall: const TextStyle(fontSize: 12.0, fontWeight: FontWeight.normal),
      labelSmall: const TextStyle(fontSize: 10.0, fontWeight: FontWeight.normal),
    ),
    useMaterial3: true,
  );
  return lightTheme.copyWith(
    textSelectionTheme: const TextSelectionThemeData(
      selectionHandleColor: Colors.white,
      selectionColor: Color(0xFF505050),
    ),
    dividerTheme: DividerThemeData(
      color: Color(0xffeeeeee),
    ),
    appBarTheme: AppBarTheme(
      systemOverlayStyle: SystemUiOverlayStyle.dark,
      backgroundColor: lightTheme.colorScheme.primary,
      foregroundColor: Colors.white,
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: ButtonStyle(side: MaterialStatePropertyAll(BorderSide(color: primaryColor, width: 1))),
    ),
    checkboxTheme: CheckboxThemeData(
      checkColor: const MaterialStatePropertyAll(Colors.black),
      fillColor: MaterialStatePropertyAll(primaryColor),
    ),
  );
}

ThemeData get darkTheme {
  final defaultTypography = Typography.whiteMountainView;
  final primaryColor = getColorFromHex(buildConfig.theme.primaryDark);
  final theme = ThemeData(
    fontFamily: buildConfig.theme.fontFamily,
    colorScheme: ColorScheme.dark(
      primary: primaryColor,
      secondary: primaryColor,
      background: const Color(0xff121212),
      surfaceVariant: const Color(0xff262626),
      error: const Color(0xff8b0000),
      tertiary: const Color(0xFFC6C4C4),
    ),
    textTheme: defaultTypography.copyWith(
      headlineSmall: defaultTypography.headlineSmall?.apply(color: Colors.white),
      titleLarge: const TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold),
      titleMedium: const TextStyle(fontSize: 18.0, fontWeight: FontWeight.bold),
      titleSmall: const TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold),
      bodyLarge: const TextStyle(fontSize: 15.0, fontWeight: FontWeight.normal),
      bodyMedium: const TextStyle(fontSize: 14.0, fontWeight: FontWeight.normal),
      bodySmall: const TextStyle(fontSize: 12.0, fontWeight: FontWeight.normal),
      labelSmall: const TextStyle(fontSize: 10.0, fontWeight: FontWeight.normal),
    ),
    useMaterial3: true,
  );
  return theme.copyWith(
    textSelectionTheme: const TextSelectionThemeData(
      selectionHandleColor: Colors.white,
      selectionColor: Color(0xFF505050),
    ),
    dividerTheme: DividerThemeData(
      color: Color(0xFF505050),
    ),
    appBarTheme: AppBarTheme(systemOverlayStyle: SystemUiOverlayStyle.light, color: theme.colorScheme.primary),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: ButtonStyle(side: MaterialStatePropertyAll(BorderSide(color: primaryColor, width: 1))),
    ),
    checkboxTheme: CheckboxThemeData(
      checkColor: const MaterialStatePropertyAll(Colors.white),
      fillColor: MaterialStatePropertyAll(primaryColor),
    ),
  );
}
