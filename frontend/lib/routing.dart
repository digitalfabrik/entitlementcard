import 'package:flutter/material.dart';

class AppRoute extends MaterialPageRoute<dynamic> {
  AppRoute({required WidgetBuilder builder, super.settings})
    : super(
        builder: (BuildContext context) {
          final theme = Theme.of(context);
          return Material(color: theme.colorScheme.surface, child: builder(context));
        },
      );
}
