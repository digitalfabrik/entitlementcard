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

/// Visible minimum size of buttons. 48 dp height meets WCAG 2.5.5 Target Size (Enhanced, 44x44).
const _buttonMinimumSize = Size(64, 48);

SystemUiOverlayStyle systemOverlayStyleFromAppBarBackgroundColor(Color color) {
  return color.computeLuminance() > 0.5 ? SystemUiOverlayStyle.dark : SystemUiOverlayStyle.light;
}

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
      surface: backgroundColor,
      surfaceContainerHighest: const Color(0xffefefef),
      outlineVariant: const Color(0xffeeeeee),
      surfaceTint: Colors.white54,
      error: const Color(0xffcc0000),
      tertiary: const Color(0xFF505050),
    ),
    dialogTheme: DialogThemeData(
      titleTextStyle: titleLarge.apply(color: textColor),
      contentTextStyle: bodyLarge.apply(color: textColor),
    ),
    listTileTheme: ListTileThemeData(
      titleTextStyle: bodyLarge.apply(color: textColor),
      subtitleTextStyle: bodySmall.apply(color: textColor),
    ),
    snackBarTheme: SnackBarThemeData(
      backgroundColor: primaryColor,
      contentTextStyle: bodyLarge.apply(color: backgroundColor),
    ),
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
    dividerTheme: DividerThemeData(color: lightTheme.colorScheme.outlineVariant),
    appBarTheme: AppBarTheme(
      systemOverlayStyle: SystemUiOverlayStyle.light,
      backgroundColor: lightTheme.colorScheme.primary,
      foregroundColor: backgroundColor,
      titleTextStyle: titleMedium,
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: ButtonStyle(
        minimumSize: const WidgetStatePropertyAll(_buttonMinimumSize),
        side: WidgetStatePropertyAll(BorderSide(color: primaryColor, width: 1)),
      ),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: ButtonStyle(
        minimumSize: const WidgetStatePropertyAll(_buttonMinimumSize),
        backgroundColor: WidgetStatePropertyAll(primaryColor),
      ),
    ),
    checkboxTheme: CheckboxThemeData(
      checkColor: WidgetStatePropertyAll(textColor),
      fillColor: WidgetStatePropertyAll(primaryColor),
    ),
    chipTheme: ChipThemeData(
      backgroundColor: backgroundColor,
      selectedColor: Colors.grey.shade300,
      side: BorderSide.none,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
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
      surface: backgroundColor,
      surfaceContainerHighest: const Color(0xff262626),
      // Used for subtle borders and dividers. If unset, Flutter falls back to onSurface (white).
      outlineVariant: const Color(0xFF505050),
      surfaceTint: Colors.white,
      error: const Color(0xff8b0000),
      tertiary: const Color(0xFFC6C4C4),
    ),
    dialogTheme: DialogThemeData(titleTextStyle: titleMedium, contentTextStyle: bodySmall),
    listTileTheme: ListTileThemeData(titleTextStyle: bodyLarge, subtitleTextStyle: bodySmall),
    snackBarTheme: SnackBarThemeData(
      backgroundColor: primaryColor,
      contentTextStyle: bodyLarge.apply(color: backgroundColor),
    ),
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
    dividerTheme: DividerThemeData(color: theme.colorScheme.outlineVariant),
    appBarTheme: AppBarTheme(
      systemOverlayStyle: SystemUiOverlayStyle.light,
      backgroundColor: theme.colorScheme.primary,
      foregroundColor: Colors.white,
      titleTextStyle: titleMedium,
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: ButtonStyle(
        minimumSize: const WidgetStatePropertyAll(_buttonMinimumSize),
        side: WidgetStatePropertyAll(BorderSide(color: primaryColor, width: 1)),
      ),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: ButtonStyle(
        minimumSize: const WidgetStatePropertyAll(_buttonMinimumSize),
        backgroundColor: WidgetStatePropertyAll(primaryColor),
      ),
    ),
    checkboxTheme: CheckboxThemeData(
      checkColor: const WidgetStatePropertyAll(Colors.white),
      fillColor: WidgetStatePropertyAll(primaryColor),
    ),
    chipTheme: ChipThemeData(
      backgroundColor: backgroundColor,
      selectedColor: Colors.grey.shade700,
      side: BorderSide.none,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
    ),
  );
}
