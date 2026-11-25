import 'package:flutter/material.dart';

/// An entry of a list whose entries are drawn as one outlined block with rounded corners.
/// Only the first entry has rounded top corners and only the last entry has rounded bottom corners.
class GroupedListItem extends StatelessWidget {
  final bool isFirst;
  final bool isLast;
  final Widget child;

  const GroupedListItem({super.key, required this.isFirst, required this.isLast, required this.child});

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;

    const radius = Radius.circular(12);
    final borderRadius = BorderRadius.vertical(
      top: isFirst ? radius : Radius.zero,
      bottom: isLast ? radius : Radius.zero,
    );
    final borderSide = BorderSide(color: colorScheme.outlineVariant);
    final border = Border(
      top: isFirst ? borderSide : BorderSide.none,
      left: borderSide,
      right: borderSide,
      bottom: borderSide,
    );

    return SafeArea(
      top: false,
      bottom: false,
      child: Container(
        foregroundDecoration: BoxDecoration(border: border, borderRadius: borderRadius),
        child: Material(
          color: colorScheme.surface,
          shape: RoundedRectangleBorder(borderRadius: borderRadius),
          // Clips the ink splashes of the child to the rounded corners
          clipBehavior: Clip.antiAlias,
          child: child,
        ),
      ),
    );
  }
}
