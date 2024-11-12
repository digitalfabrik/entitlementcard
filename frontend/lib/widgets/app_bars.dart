/// These widgets wrap the material AppBar into sized box widgets which can be
/// used like the apple navigation bars.
library navigation_bars;

import 'package:ehrenamtskarte/debouncer.dart';
import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

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

  const AppBarWithBottom({
    super.key,
    required this.flexibleSpace,
    this.color,
    required this.bottom,
    this.actions,
  });

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

class SearchSliverAppBar extends StatefulWidget {
  final ValueChanged<String> onChanged;
  final Debouncer debouncer = Debouncer(delay: const Duration(milliseconds: 50));

  SearchSliverAppBar({super.key, required this.onChanged});

  @override
  SearchSliverAppBarState createState() => SearchSliverAppBarState();
}

class SearchSliverAppBarState extends State<SearchSliverAppBar> {
  final TextEditingController textEditingController = TextEditingController();
  final FocusNode focusNode = FocusNode();

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final theme = Theme.of(context);
    final foregroundColor = theme.appBarTheme.foregroundColor;
    return SliverAppBar(
      title: TextField(
        onTapOutside: (PointerDownEvent event) {
          focusNode.nextFocus();
        },
        onChanged: _onSearchFieldTextChanged,
        controller: textEditingController,
        focusNode: focusNode,
        decoration: InputDecoration.collapsed(
          hintText: t.search.searchHint,
          hintStyle: theme.textTheme.bodyLarge,
        ),
        cursorColor: foregroundColor,
        style: theme.textTheme.bodyLarge?.apply(color: foregroundColor),
      ),
      pinned: true,
      actionsIconTheme: IconThemeData(color: foregroundColor),
      actions: [
        if (textEditingController.value.text.isNotEmpty)
          IconButton(icon: const Icon(Icons.clear), onPressed: _clearInput, color: foregroundColor),
        Padding(
          padding: const EdgeInsets.only(right: 15.0),
          child: Icon(Icons.search, color: foregroundColor?.withOpacity(0.9)),
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

  _onSearchFieldTextChanged(String text) {
    widget.debouncer.run(() => widget.onChanged(text.trim()));
  }

  _clearInput() {
    textEditingController.clear();
    _onSearchFieldTextChanged(textEditingController.value.text);
  }
}
