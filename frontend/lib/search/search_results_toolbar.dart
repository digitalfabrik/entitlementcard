import 'package:flutter/material.dart';

class SearchResultsToolbar extends StatelessWidget implements PreferredSizeWidget {
  static const double _verticalPadding = 4;
  static const double height = kMinInteractiveDimension + 2 * _verticalPadding;

  final Widget child;

  const SearchResultsToolbar({super.key, required this.child});

  @override
  Size get preferredSize => const Size.fromHeight(height);

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: Theme.of(context).colorScheme.surface,
      child: SafeArea(
        top: false,
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: _verticalPadding),
          child: Align(alignment: AlignmentDirectional.centerStart, child: child),
        ),
      ),
    );
  }
}
