import 'package:flutter/material.dart';

void showSnackBar(BuildContext context, String message, [Color? backgroundColor]) {
  final theme = Theme.of(context);
  final primaryColor = theme.colorScheme.primary;
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      backgroundColor: backgroundColor ?? primaryColor,
      content: Text(message),
    ),
  );
}
