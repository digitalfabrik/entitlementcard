import 'package:flutter/material.dart';

import '../../widgets/error_message.dart';
import '../detail/detail_view.dart';
import 'accepting_store_preview_card_content.dart';
import 'models.dart';

class AcceptingStorePreviewCard extends StatelessWidget {
  final bool isLoading;
  final Function refetch;
  final /*?*/ AcceptingStoreSummary acceptingStore;

  AcceptingStorePreviewCard(
      {this.isLoading, this.acceptingStore, this.refetch, Key key})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    var onTap = isLoading
        ? null
        : acceptingStore == null
            ? refetch
            : () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) =>
                      DetailView(acceptingStore.id, hideShowOnMapButton: true),
                ));
    return Container(
        alignment: Alignment.bottomCenter,
        child: SizedBox(
          width: double.infinity,
          child: Card(
              margin: const EdgeInsets.all(10),
              child: InkWell(
                onTap: onTap,
                child: Padding(
                    padding: const EdgeInsets.all(10),
                    child: AnimatedSwitcher(
                        duration: Duration(milliseconds: 200),
                        child: isLoading
                            ? Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 30, vertical: 16),
                                child: const LinearProgressIndicator())
                            : acceptingStore == null
                                ? ErrorMessage("Fehler beim Laden der Infos.")
                                : AcceptingStorePreviewCardContent(
                                    acceptingStore))),
              )),
        ));
  }
}
