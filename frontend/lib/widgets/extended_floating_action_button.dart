import 'package:ehrenamtskarte/widgets/small_button_spinner.dart';
import 'package:flutter/material.dart';

class ExtendedFloatingActionButton extends StatelessWidget {
  final String label;
  final bool loading;
  final IconData icon;
  final void Function() onPressed;

  const ExtendedFloatingActionButton(
      {super.key,
      required this.label,
      required this.onPressed,
      this.loading = false,
      required this.icon});

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton.extended(
      backgroundColor: Theme.of(context).colorScheme.surfaceVariant,
      elevation: 1,
      onPressed: onPressed,
      icon: AnimatedSwitcher(
        duration: const Duration(milliseconds: 200),
        child: loading
            ? const SmallButtonSpinner()
            : Icon(
                icon,
                size: 24,
                color: Theme.of(context).colorScheme.secondary,
              ),
      ),
      label: Text(
        label,
        style: TextStyle(color: Theme.of(context).hintColor),
      ),
    );
  }
}
