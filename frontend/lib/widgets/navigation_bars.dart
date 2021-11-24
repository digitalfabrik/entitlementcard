/// These widgets wrap the material AppBar into sized box widgets which can be
/// used like the apple navigation bars.
library navigation_bars;

import 'package:flutter/material.dart';

import '../debouncer.dart';

/// null means that the default bg color is chosen. other possibility: Colors.transparent
const kBackgroundColor = null;

/// null means that the default fg color is chosen.
const kForegroundColor = null;
const kElevation = 0.0;

class NavigationBar extends StatelessWidget {
  final String title;
  final List<Widget>? actions;

  const NavigationBar({Key? key, required this.title, this.actions})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppBar(
        backgroundColor: kBackgroundColor,
        foregroundColor: kForegroundColor,
        elevation: kElevation,
        title: Text(title),
        actions: actions);
  }
}

class NavigationBarWithBottom extends StatelessWidget {
  final Widget flexibleSpace;
  final Color? color;
  final PreferredSizeWidget bottom;

  const NavigationBarWithBottom({
    Key? key,
    required this.flexibleSpace,
    this.color,
    required this.bottom,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Note: A SizedBox is required because AppBar contains a Column.
    // If we want to add a AppBar into a column, then we need to set its size.
    return SizedBox(
        height: MediaQuery.of(context).padding.top +
            bottom.preferredSize.height +
            kToolbarHeight,
        child: AppBar(
            elevation: kElevation,
            leading: const BackButton(),
            flexibleSpace: flexibleSpace,
            backgroundColor: color,
            foregroundColor: kForegroundColor,
            bottom: bottom));
  }
}

class SliverNavigationBar extends StatelessWidget {
  final String title;

  const SliverNavigationBar({Key? key, required this.title}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SliverAppBar(
      backgroundColor: kBackgroundColor,
      elevation: kElevation,
      foregroundColor: kForegroundColor,
      title: Text(title),
    );
  }
}

class SliverSearchNavigationBar extends StatefulWidget {
  final ValueChanged<String> onChanged;
  final Debouncer debouncer =
      Debouncer(delay: const Duration(milliseconds: 50));

  SliverSearchNavigationBar({Key? key, required this.onChanged})
      : super(key: key);

  @override
  _SliverSearchNavigationBarState createState() =>
      _SliverSearchNavigationBarState();
}

class _SliverSearchNavigationBarState extends State<SliverSearchNavigationBar> {
  final TextEditingController textEditingController = TextEditingController();
  final FocusNode focusNode = FocusNode();

  @override
  Widget build(BuildContext context) {
    const appBarTextStyle = TextStyle(color: Colors.white);
    return SliverAppBar(
      backgroundColor: kBackgroundColor,
      foregroundColor: kForegroundColor,
      title: TextField(
        onChanged: _onSearchFieldTextChanged,
        controller: textEditingController,
        focusNode: focusNode,
        decoration: const InputDecoration.collapsed(
          hintText: "Tippen, um zu suchen …",
          hintStyle: appBarTextStyle,
        ),
        cursorColor: Colors.white,
        style: appBarTextStyle,
      ),
      pinned: true,
      actions: [
        if (textEditingController.value.text.isNotEmpty)
          IconButton(icon: const Icon(Icons.clear), onPressed: _clearInput),
        IconButton(
          icon: const Icon(Icons.search),
          onPressed: _onSearchPressed,
        )
      ],
    );
  }

  @override
  void dispose() {
    super.dispose();
    focusNode.dispose();
    textEditingController.dispose();
  }

  _onSearchPressed() {
    if (focusNode.hasPrimaryFocus) {
      focusNode.nextFocus();
    } else {
      focusNode.requestFocus();
    }
  }

  _onSearchFieldTextChanged(String text) {
    widget.debouncer.run(() => widget.onChanged(text));
  }

  _clearInput() {
    textEditingController.clear();
    _onSearchFieldTextChanged(textEditingController.value.text);
  }
}
