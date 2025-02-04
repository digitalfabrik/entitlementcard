import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class CustomAlertDialog extends StatelessWidget {
  final IconData? icon;
  final Color? iconColor;
  final String title;
  final String? message;
  final Widget? customContent;
  final List<Widget>? actions;

  const CustomAlertDialog({
    super.key,
    this.icon,
    this.iconColor,
    required this.title,
    this.message,
    this.customContent,
    this.actions,
  });

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      titlePadding: EdgeInsets.all(4),
      contentPadding: EdgeInsets.symmetric(horizontal: 20),
      actionsPadding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
      title: _buildTitle(context),
      content: _buildContent(context),
      actions: _buildActions(context),
    );
  }

  Widget _buildTitle(BuildContext context) {
    final theme = Theme.of(context);
    return ListTile(
      leading: icon != null ? Icon(icon, color: iconColor ?? theme.colorScheme.primaryContainer, size: 30) : null,
      title: Text(title, style: theme.textTheme.titleMedium),
    );
  }

  Widget _buildContent(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (message != null) Text(message!, style: Theme.of(context).textTheme.bodyMedium),
        if (customContent != null)
          Flexible(
            child: Padding(
              padding: message != null ? const EdgeInsets.only(top: 8.0) : EdgeInsets.zero,
              child: customContent,
            ),
          )
      ],
    );
  }

  List<Widget> _buildActions(BuildContext context) {
    return actions ??
        [
          TextButton(
            onPressed: () => Navigator.of(context, rootNavigator: true).pop(),
            child: Text(t.common.ok),
          ),
        ];
  }
}
