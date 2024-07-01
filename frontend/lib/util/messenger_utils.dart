import 'package:flutter/material.dart';

void showSnackBar(BuildContext context, String message, [Color? backgroundColor]) {
  final primaryColor = Theme.of(context).colorScheme.primary;
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
      backgroundColor: backgroundColor ?? primaryColor,
      content: Text(message),
    ),
  );
}
