import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:flutter/material.dart';

class NoResultsFound extends StatelessWidget {
  final bool hasActiveFilters;
  final VoidCallback onResetFilters;

  const NoResultsFound({super.key, required this.hasActiveFilters, required this.onResetFilters});

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Align(
      alignment: Alignment.topCenter,
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ExcludeSemantics(
              child: Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: colorScheme.surfaceContainerHighest,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: colorScheme.outlineVariant),
                ),
                child: Icon(Icons.search, size: 28, color: theme.hintColor),
              ),
            ),
            const SizedBox(height: 24),
            Semantics(
              header: true,
              child: Text(
                t.search.noResultsTitle,
                textAlign: TextAlign.center,
                style: theme.textTheme.titleSmall?.apply(color: colorScheme.onSurface),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              hasActiveFilters ? t.search.noResultsDescription : t.search.noAcceptingStoresAvailable,
              textAlign: TextAlign.center,
              style: theme.textTheme.bodyLarge?.apply(color: theme.hintColor),
            ),
            if (hasActiveFilters) ...[
              const SizedBox(height: 24),
              FilledButton(onPressed: onResetFilters, child: Text(t.search.resetFilters)),
            ],
          ],
        ),
      ),
    );
  }
}
