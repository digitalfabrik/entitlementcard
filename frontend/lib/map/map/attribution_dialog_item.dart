import 'package:flutter/material.dart';

class AttributionDialogItem extends StatelessWidget {
  const AttributionDialogItem({
    super.key,
    required this.icon,
    required this.color,
    required this.text,
    required this.onPressed,
  });

  final IconData icon;
  final Color color;
  final String text;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return SimpleDialogOption(
      onPressed: onPressed,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Icon(icon, size: 24.0, color: color),
          Flexible(
            child: Container(
              padding: const EdgeInsetsDirectional.only(start: 8.0),
              child: Text(text, style: theme.textTheme.bodySmall?.apply(color: color)),
            ),
          ),
        ],
      ),
    );
  }
}
