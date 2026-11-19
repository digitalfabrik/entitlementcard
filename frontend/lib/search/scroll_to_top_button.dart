import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:flutter/material.dart';

class ScrollToTopButton extends StatelessWidget {
  // Standard height for material 3 extended FloatingActionButton
  static const double height = 56;

  final VoidCallback onPressed;

  const ScrollToTopButton({super.key, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    return FloatingActionButton.extended(
      heroTag: null,
      onPressed: onPressed,
      backgroundColor: colorScheme.primary,
      foregroundColor: colorScheme.onPrimary,
      shape: const StadiumBorder(),
      icon: const Icon(Icons.arrow_upward),
      label: Text(context.t.search.scrollToTop),
    );
  }
}
