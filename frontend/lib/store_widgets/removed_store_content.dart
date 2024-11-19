import 'package:ehrenamtskarte/sentry.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'package:ehrenamtskarte/favorites/favorites_model.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/util/messenger_utils.dart';

class RemovedStoreContent extends StatelessWidget {
  final int storeId;

  const RemovedStoreContent({super.key, required this.storeId});

  @override
  Widget build(BuildContext context) {
    final favoritesProvider = Provider.of<FavoritesModel>(context);
    return Expanded(
        child: Scaffold(
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                t.store.acceptingStoreNotAvailable,
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              Text(
                t.store.removeDescription,
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              Divider(thickness: 0.7, height: 48, color: Theme.of(context).primaryColorLight),
              ButtonBar(
                alignment: MainAxisAlignment.center,
                children: [
                  OutlinedButton(
                      child: Text(t.store.removeButtonText),
                      onPressed: () async {
                        await _removeFavorite(context, favoritesProvider);
                      }),
                ],
              ),
            ],
          ),
        ),
      ),
    ));
  }

  Future<void> _removeFavorite(BuildContext context, FavoritesModel model) async {
    try {
      await model.removeFavorite(storeId);
      if (!context.mounted) return;
      showSnackBar(context, t.favorites.favoriteHasBeenRemoved);
      Navigator.of(context).maybePop();
    } catch (error, stackTrace) {
      reportError(error, stackTrace);
      if (!context.mounted) return;
      showSnackBar(context, t.favorites.updateFailed, Theme.of(context).colorScheme.error);
    }
  }
}
