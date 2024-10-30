import 'package:ehrenamtskarte/routing.dart';
import 'package:ehrenamtskarte/widgets/app_bars.dart';
import 'package:flutter/material.dart';

class ContentTile extends StatelessWidget {
  final String title;
  final List<Widget> children;
  final IconData icon;

  const ContentTile({super.key, required this.title, required this.children, required this.icon});

  @override
  Widget build(BuildContext context) {
    return ListTile(
        leading: Icon(icon),
        title: Text(title, style: Theme.of(context).textTheme.bodyLarge),
        onTap: () => _showContent(context));
  }

  void _showContent(BuildContext context) {
    Navigator.of(context, rootNavigator: true).push(
      AppRoute(
        builder: (context) => ContentPage(title: title, children: children),
      ),
    );
  }
}

class ContentPage extends StatelessWidget {
  final String title;
  final List<Widget> children;

  const ContentPage({super.key, required this.title, required this.children});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return DecoratedBox(
      decoration: BoxDecoration(color: theme.colorScheme.background),
      child: CustomScrollView(
        slivers: <Widget>[
          CustomSliverAppBar(title: title),
          SliverPadding(
            padding: const EdgeInsets.all(10),
            sliver: SliverList(
              delegate: SliverChildListDelegate(children),
            ),
          )
        ],
      ),
    );
  }
}
