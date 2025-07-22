import 'package:ehrenamtskarte/favorites/favorites_loader.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:flutter/material.dart';

class FavoritesPage extends StatefulWidget {
  const FavoritesPage({super.key});

  @override
  State<StatefulWidget> createState() => _FavoritesPageState();
}

class _FavoritesPageState extends State<FavoritesPage> {
  @override
  Widget build(BuildContext context) {
    final t = context.t;
    return Material(
      child: Stack(
        children: [
          CustomScrollView(
            slivers: [
              SliverAppBar(title: Text(t.favorites.title)),
              FavoritesLoader(),
            ],
          ),
        ],
      ),
    );
  }
}
