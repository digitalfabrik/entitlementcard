import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class InfoDialog extends StatelessWidget {
  final Widget child;
  final String title;
  final IconData icon;
  final Color? iconColor;

  const InfoDialog({
    super.key,
    required this.child,
    required this.title,
    required this.icon,
    this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final theme = Theme.of(context);
    return AlertDialog(
      title: ListTile(
        leading: Icon(icon, color: iconColor ?? theme.colorScheme.primaryContainer, size: 30),
        title: Text(title, style: theme.textTheme.headlineSmall),
      ),
      content: child,
      actions: [
        TextButton(
            onPressed: () => Navigator.of(context, rootNavigator: true).pop(),
            child: Text(t.common.ok),
            style: theme.textButtonTheme.style)
      ],
    );
  }
}
