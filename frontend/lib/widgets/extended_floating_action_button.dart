import 'package:ehrenamtskarte/widgets/small_button_spinner.dart';
import 'package:flutter/material.dart';

class ExtendedFloatingActionButton extends StatelessWidget {
  final String label;
  final bool loading;
  final IconData icon;
  final void Function() onPressed;

  const ExtendedFloatingActionButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.loading = false,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return FloatingActionButton.extended(
      backgroundColor: theme.colorScheme.surfaceContainerHighest,
      elevation: 1,
      onPressed: onPressed,
      icon: AnimatedSwitcher(
        duration: const Duration(milliseconds: 200),
        child: loading ? const SmallButtonSpinner() : Icon(icon, size: 24, color: theme.colorScheme.secondary),
      ),
      label: Text(label, style: theme.textTheme.bodyMedium?.apply(color: theme.hintColor)),
    );
  }
}
