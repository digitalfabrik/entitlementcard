import 'package:flutter/material.dart';

final lightTheme = ThemeData.from(
    colorScheme: ColorScheme.light(
      primary: Color(0xff5f5384),
      secondary: Color(0xff5f5384),
    ),
    textTheme: TextTheme(
      headline6: TextStyle(fontSize: 24.0, fontWeight: FontWeight.bold),
      bodyText1: TextStyle(fontSize: 15.0, fontWeight: FontWeight.normal),
      bodyText2: TextStyle(fontSize: 15.0, color: Color(0xFF505050)),
    ));

ThemeData get darkTheme {
  var theme = ThemeData.from(
      colorScheme: ColorScheme.dark(
        primary: Color(0xff5f5384),
        secondary: Color(0xff5f5384),
      ),
      textTheme: TextTheme(
        headline6: TextStyle(fontSize: 24.0, fontWeight: FontWeight.bold),
        bodyText1: TextStyle(fontSize: 15.0, fontWeight: FontWeight.normal),
        bodyText2: TextStyle(fontSize: 15.0, color: Color(0xFFC6C4C4)),
      ));
  return theme.copyWith(
      appBarTheme: AppBarTheme(color: theme.colorScheme.primary));
}
