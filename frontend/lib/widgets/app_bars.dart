/// These widgets wrap the material AppBar into sized box widgets which can be
/// used like the apple navigation bars.
library;

import 'package:ehrenamtskarte/category_assets.dart';
import 'package:ehrenamtskarte/debouncer.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/search/category_filter_bar.dart';
import 'package:ehrenamtskarte/themes.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

class CustomAppBar extends StatelessWidget {
  final String title;
  final List<Widget>? actions;

  const CustomAppBar({super.key, required this.title, this.actions});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final foregroundColor = theme.appBarTheme.foregroundColor;
    return AppBar(
      leading: BackButton(color: foregroundColor),
      title: Text(title),
      actions: actions,
    );
  }
}

class AppBarWithBottom extends StatelessWidget {
  final Widget flexibleSpace;
  final Color? color;
  final PreferredSizeWidget bottom;
  final List<Widget>? actions;

  const AppBarWithBottom({super.key, required this.flexibleSpace, this.color, required this.bottom, this.actions});

  @override
  Widget build(BuildContext context) {
    final foregroundColor = Theme.of(context).appBarTheme.foregroundColor;
    // Note: A SizedBox is required because AppBar contains a Column.
    // If we want to add a AppBar into a column, then we need to set its size.
    return SizedBox(
      height: MediaQuery.of(context).padding.top + bottom.preferredSize.height + kToolbarHeight,
      child: AppBar(
        leading: BackButton(color: foregroundColor),
        flexibleSpace: flexibleSpace,
        backgroundColor: color,
        bottom: bottom,
        actions: actions,
      ),
    );
  }
}

class CustomSliverAppBar extends StatelessWidget {
  final String title;

  const CustomSliverAppBar({super.key, required this.title});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final foregroundColor = theme.appBarTheme.foregroundColor;
    return SliverAppBar(
      leading: BackButton(color: foregroundColor),
      iconTheme: IconThemeData(color: foregroundColor),
      title: Text(title, style: theme.textTheme.titleMedium?.apply(color: theme.appBarTheme.foregroundColor)),
      pinned: true,
    );
  }
}

// This gradient is translated over from the [Android GradientProtection](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:core/core/src/main/java/androidx/core/view/insets/GradientProtection.java)
const _path = Cubic(0.24, 0.0, 0.58, 1);
const _steps = 100;
final _stops = List.generate(_steps, (index) => index.toDouble() / (_steps - 1).toDouble(), growable: false);
final _alphas = _stops.map((stop) => _path.transform(stop)).toList(growable: false);

class StatusBarProtectorFlexibleSpace extends StatelessWidget {
  final Color backgroundColor;

  const StatusBarProtectorFlexibleSpace({super.key, required this.backgroundColor});

  @override
  Widget build(BuildContext context) {
    final originalOpacity = backgroundColor.a;
    return LayoutBuilder(
      builder: (context, constraints) => OverflowBox(
        fit: OverflowBoxFit.max,
        alignment: Alignment.topCenter,
        // Just like Android's GradientProtection overdraw by a factor of 1.2.
        maxHeight: constraints.maxHeight * 1.2,
        maxWidth: constraints.maxWidth,
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.bottomCenter,
              end: Alignment.topCenter,
              colors: _alphas
                  .map((alpha) => backgroundColor.withValues(alpha: originalOpacity * alpha))
                  .toList(growable: false),
            ),
          ),
        ),
      ),
    );
  }
}

/// Applies an appropriate system overlay style, protects the system status bar with a transparency gradient,
/// and takes care of the top unsafe area.
class StatusBarProtector extends StatelessWidget implements PreferredSizeWidget {
  /// As per [Android documentation](https://developer.android.com/develop/ui/views/layout/edge-to-edge), this
  /// is ideally, the pane's background color with 80% opacity.
  /// If unset, `colorScheme.surface.withValues(alpha:0.8)` is used.
  final Color? backgroundColor;

  const StatusBarProtector({super.key, this.backgroundColor});

  @override
  Widget build(BuildContext context) {
    final backgroundColor = this.backgroundColor ?? Theme.of(context).colorScheme.surface.withValues(alpha: 0.8);
    return AppBar(
      backgroundColor: Colors.transparent,
      toolbarHeight: 0.0,
      flexibleSpace: StatusBarProtectorFlexibleSpace(backgroundColor: backgroundColor),
      systemOverlayStyle: systemOverlayStyleFromAppBarBackgroundColor(backgroundColor),
    );
  }

  @override
  Size get preferredSize => AppBar(toolbarHeight: 0).preferredSize;
}

/// Applies an appropriate system overlay style, protects the system status bar with a transparency gradient,
/// and fills the unsafe top area of a sliver scroller.
class SliverStatusBarProtector extends StatelessWidget {
  /// As per [Android documentation](https://developer.android.com/develop/ui/views/layout/edge-to-edge), this
  /// is ideally, the pane's background color with 80% opacity.
  /// If unset, `colorScheme.surface.withValues(alpha:0.8)` is used.
  final Color? backgroundColor;

  const SliverStatusBarProtector({super.key, this.backgroundColor});

  @override
  Widget build(BuildContext context) {
    final backgroundColor = this.backgroundColor ?? Theme.of(context).colorScheme.surface.withValues(alpha: 0.8);
    return SliverAppBar(
      backgroundColor: Colors.transparent,
      toolbarHeight: 0.0,
      pinned: true,
      stretch: false,
      surfaceTintColor: Colors.transparent,
      flexibleSpace: StatusBarProtectorFlexibleSpace(backgroundColor: backgroundColor),
      systemOverlayStyle: systemOverlayStyleFromAppBarBackgroundColor(backgroundColor),
    );
  }
}

class SliverSearchAppBar extends StatefulWidget {
  final ValueChanged<String> onChanged;
  final void Function(CategoryAsset, bool) onCategoryPress;
  final Debouncer debouncer = Debouncer(delay: const Duration(milliseconds: 50));

  SliverSearchAppBar({super.key, required this.onChanged, required this.onCategoryPress});

  @override
  SliverSearchAppBarState createState() => SliverSearchAppBarState(onCategoryPress);
}

class SliverSearchAppBarState extends State<SliverSearchAppBar> {
  final TextEditingController textEditingController = TextEditingController();
  final FocusNode focusNode = FocusNode();
  final void Function(CategoryAsset, bool) onCategoryPress;

  SliverSearchAppBarState(this.onCategoryPress);

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final theme = Theme.of(context);
    final foregroundColor = theme.appBarTheme.foregroundColor;

    return SliverAppBar(
      pinned: true,
      snap: true,
      floating: true,
      // TODO Calculate the CategoryFilterBar's height and set it here
      expandedHeight: 250,
      title: TextField(
        onTapOutside: (PointerDownEvent event) {
          focusNode.nextFocus();
        },
        onChanged: _onSearchFieldTextChanged,
        controller: textEditingController,
        focusNode: focusNode,
        decoration: InputDecoration.collapsed(
          hintText: t.search.searchHint,
          hintStyle: theme.textTheme.bodyLarge?.apply(color: foregroundColor),
        ),
        cursorColor: foregroundColor,
        style: theme.textTheme.bodyLarge?.apply(color: foregroundColor),
      ),
      flexibleSpace: CategoryFilterBar(onCategoryPress: onCategoryPress),
      actionsIconTheme: IconThemeData(color: foregroundColor),
      actions: [
        if (textEditingController.value.text.isNotEmpty)
          IconButton(icon: const Icon(Icons.clear), onPressed: _clearInput, color: foregroundColor),
        Padding(
          padding: const EdgeInsets.only(right: 15.0),
          child: Icon(Icons.search, color: foregroundColor?.withValues(alpha: 0.9)),
        ),
      ],
    );
  }

  @override
  void dispose() {
    super.dispose();
    focusNode.dispose();
    textEditingController.dispose();
  }

  void _onSearchFieldTextChanged(String text) {
    widget.debouncer.run(() => widget.onChanged(text.trim()));
  }

  void _clearInput() {
    textEditingController.clear();
    _onSearchFieldTextChanged(textEditingController.value.text);
  }
}
