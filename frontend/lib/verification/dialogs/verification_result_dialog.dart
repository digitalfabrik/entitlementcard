import 'package:flutter/material.dart';

class VerificationResultDialog extends StatelessWidget {
  final Widget child;
  final String title;
  final IconData icon;
  final Color? iconColor;

  const VerificationResultDialog({
    Key? key,
    required this.child,
    required this.title,
    required this.icon,
    this.iconColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return AlertDialog(
      title: ListTile(
        leading: Icon(icon, color: iconColor ?? theme.colorScheme.primaryVariant, size: 30),
        title: Text(title, style: theme.textTheme.headline5),
      ),
      content: child,
      actions: [TextButton(onPressed: () => Navigator.of(context).pop(), child: const Text("OK"))],
    );
  }
}
