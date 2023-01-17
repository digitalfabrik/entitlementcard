import 'package:ehrenamtskarte/build_config/build_config.dart';
import 'package:ehrenamtskarte/util/color_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

ThemeData get lightTheme {
  const defaultTypography = Typography.blackMountainView;
  final primaryColor = getColorFromHex(buildConfig.theme.primaryLight);
  final lightTheme = ThemeData.from(
    colorScheme: ColorScheme.light(
      primary: primaryColor,
      secondary: primaryColor,
      background: Colors.white,
      surfaceVariant: const Color(0xffededed),
    ),
    textTheme: defaultTypography.copyWith(
      headline4: defaultTypography.headline4?.apply(color: Colors.black87),
      headline5: defaultTypography.headline4?.apply(color: Colors.black87),
      headline6: const TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold),
      bodyText1: const TextStyle(fontSize: 15.0, fontWeight: FontWeight.normal),
      bodyText2: const TextStyle(fontSize: 15.0, color: Color(0xFF505050)),
    ),
    useMaterial3: true,
  );
  return lightTheme.copyWith(
    textSelectionTheme: const TextSelectionThemeData(
      selectionHandleColor: Colors.white,
      selectionColor: Color(0xFF505050),
    ),
    appBarTheme: AppBarTheme(
      systemOverlayStyle: SystemUiOverlayStyle.light,
      backgroundColor: lightTheme.colorScheme.primary,
      foregroundColor: Colors.white,
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: ButtonStyle(side: MaterialStatePropertyAll(BorderSide(color: primaryColor, width: 1))),
    ),
  );
}

ThemeData get darkTheme {
  const defaultTypography = Typography.whiteMountainView;
  final primaryColor = getColorFromHex(buildConfig.theme.primaryDark);
  final theme = ThemeData.from(
    colorScheme: ColorScheme.dark(
      primary: primaryColor,
      secondary: primaryColor,
      background: const Color(0xff121212),
      surfaceVariant: const Color(0xff262626),
    ),
    textTheme: defaultTypography.copyWith(
      headline4: defaultTypography.headline4?.apply(color: Colors.white),
      headline5: defaultTypography.headline4?.apply(color: Colors.white),
      headline6: const TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold),
      bodyText1: const TextStyle(fontSize: 15.0, fontWeight: FontWeight.normal),
      bodyText2: const TextStyle(fontSize: 15.0, color: Color(0xFFC6C4C4)),
    ),
    useMaterial3: true,
  );
  return theme.copyWith(
    textSelectionTheme: const TextSelectionThemeData(
      selectionHandleColor: Colors.white,
      selectionColor: Color(0xFF505050),
    ),
    appBarTheme: AppBarTheme(systemOverlayStyle: SystemUiOverlayStyle.light, color: theme.colorScheme.primary),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: ButtonStyle(side: MaterialStatePropertyAll(BorderSide(color: primaryColor, width: 1))),
    ),
  );
}
