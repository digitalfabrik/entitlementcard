import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/util/color_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Typography classes
final titleLarge = const TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold);
final titleMedium = const TextStyle(fontSize: 18.0, fontWeight: FontWeight.bold);
final titleSmall = const TextStyle(fontSize: 16.0, fontWeight: FontWeight.bold);
final bodyLarge = const TextStyle(fontSize: 15.0, fontWeight: FontWeight.normal);
final bodyMedium = const TextStyle(fontSize: 14.0, fontWeight: FontWeight.normal);
final bodySmall = const TextStyle(fontSize: 12.0, fontWeight: FontWeight.normal);
final labelSmall = const TextStyle(fontSize: 10.0, fontWeight: FontWeight.normal);

ThemeData get lightTheme {
  final textColor = Colors.black87;
  final defaultTypography = Typography.blackMountainView;
  final primaryColor = getColorFromHex(buildConfig.theme.primaryLight);
  final backgroundColor = Colors.white;

  final lightTheme = ThemeData(
    fontFamily: buildConfig.theme.fontFamily,
    colorScheme: ColorScheme.light(
      primary: primaryColor,
      secondary: primaryColor,
      background: backgroundColor,
      surfaceVariant: const Color(0xffefefef),
      surfaceTint: Colors.white54,
      error: const Color(0xffcc0000),
      tertiary: const Color(0xFF505050),
    ),
    dialogTheme: DialogTheme(
        titleTextStyle: titleLarge.apply(color: textColor), contentTextStyle: bodyLarge.apply(color: textColor)),
    listTileTheme: ListTileThemeData(
      titleTextStyle: bodyLarge.apply(color: textColor),
      subtitleTextStyle: bodySmall.apply(color: textColor),
    ),
    snackBarTheme:
        SnackBarThemeData(backgroundColor: primaryColor, contentTextStyle: bodyLarge.apply(color: backgroundColor)),
    textTheme: defaultTypography.copyWith(
      headlineSmall: defaultTypography.headlineSmall?.apply(color: textColor),
      titleLarge: titleLarge,
      titleMedium: titleMedium,
      titleSmall: titleSmall,
      bodyLarge: bodyLarge,
      bodyMedium: bodyMedium,
      bodySmall: bodySmall,
      labelSmall: labelSmall,
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
        foregroundColor: backgroundColor,
        titleTextStyle: titleMedium),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: ButtonStyle(side: MaterialStatePropertyAll(BorderSide(color: primaryColor, width: 1))),
    ),
    checkboxTheme: CheckboxThemeData(
      checkColor: MaterialStatePropertyAll(textColor),
      fillColor: MaterialStatePropertyAll(primaryColor),
    ),
  );
}

ThemeData get darkTheme {
  final defaultTypography = Typography.whiteMountainView;
  final primaryColor = getColorFromHex(buildConfig.theme.primaryDark);
  final backgroundColor = const Color(0xff121212);

  final theme = ThemeData(
    fontFamily: buildConfig.theme.fontFamily,
    colorScheme: ColorScheme.dark(
      primary: primaryColor,
      secondary: primaryColor,
      background: backgroundColor,
      surfaceVariant: const Color(0xff262626),
      surfaceTint: Colors.white,
      error: const Color(0xff8b0000),
      tertiary: const Color(0xFFC6C4C4),
    ),
    dialogTheme: DialogTheme(titleTextStyle: titleMedium, contentTextStyle: bodySmall),
    listTileTheme: ListTileThemeData(titleTextStyle: bodyLarge, subtitleTextStyle: bodySmall),
    snackBarTheme:
        SnackBarThemeData(backgroundColor: primaryColor, contentTextStyle: bodyLarge.apply(color: backgroundColor)),
    textTheme: defaultTypography.copyWith(
      headlineSmall: defaultTypography.headlineSmall?.apply(color: Colors.white),
      titleLarge: titleLarge,
      titleMedium: titleMedium,
      titleSmall: titleSmall,
      bodyLarge: bodyLarge,
      bodyMedium: bodyMedium,
      bodySmall: bodySmall,
      labelSmall: labelSmall,
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
    appBarTheme: AppBarTheme(
        systemOverlayStyle: SystemUiOverlayStyle.light,
        color: theme.colorScheme.primary,
        foregroundColor: Colors.white,
        titleTextStyle: titleMedium),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: ButtonStyle(side: MaterialStatePropertyAll(BorderSide(color: primaryColor, width: 1))),
    ),
    checkboxTheme: CheckboxThemeData(
      checkColor: const MaterialStatePropertyAll(Colors.white),
      fillColor: MaterialStatePropertyAll(primaryColor),
    ),
  );
}
