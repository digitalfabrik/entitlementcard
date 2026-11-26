import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:flutter/material.dart';

class SearchResultsToolbar extends StatelessWidget implements PreferredSizeWidget {
  static const double _verticalPadding = 4;
  static const double height = kMinInteractiveDimension + 2 * _verticalPadding;

  final Widget sortingButton;
  final int? totalCount;

  const SearchResultsToolbar({super.key, required this.sortingButton, this.totalCount});

  @override
  Size get preferredSize => const Size.fromHeight(height);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final totalCount = this.totalCount;
    return ColoredBox(
      color: theme.colorScheme.surface,
      child: SafeArea(
        top: false,
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: _verticalPadding),
          child: Row(
            children: [
              sortingButton,
              const Spacer(),
              if (totalCount != null)
                Text(
                  context.t.search.resultCount(n: totalCount),
                  style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
