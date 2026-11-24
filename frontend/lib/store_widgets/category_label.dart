import 'package:flutter/material.dart';

/// Small upper case label showing the (short) category name of an accepting store.
class CategoryLabel extends StatelessWidget {
  final String name;

  const CategoryLabel({super.key, required this.name});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(color: colorScheme.surfaceContainerHighest, borderRadius: BorderRadius.circular(4)),
      child: Text(
        name.toUpperCase(),
        semanticsLabel: name,
        style: theme.textTheme.bodySmall?.copyWith(
          color: theme.hintColor,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}
