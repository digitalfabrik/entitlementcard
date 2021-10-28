import 'package:flutter/material.dart';

import '../../store_widgets/accepting_store_summary.dart';
import '../../widgets/error_message.dart';
import 'models.dart';

class AcceptingStorePreviewCard extends StatelessWidget {
  final bool isLoading;
  final void Function()? refetch;
  final AcceptingStoreSummaryModel? acceptingStore;

  const AcceptingStorePreviewCard(
      {Key? key, required this.isLoading, this.acceptingStore, this.refetch})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    final currentAcceptingStore = acceptingStore;
    return Container(
      alignment: Alignment.bottomCenter,
      child: SizedBox(
        width: double.infinity,
        height: 95,
        child: Card(
            margin: const EdgeInsets.all(10),
            child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 200),
                child: isLoading
                    ? Container(
                        padding: const EdgeInsets.symmetric(horizontal: 40),
                        child: const LinearProgressIndicator())
                    : currentAcceptingStore == null
                        ? InkWell(
                            onTap: refetch,
                            child: Container(
                                height: double.infinity,
                                padding:
                                    const EdgeInsets.symmetric(horizontal: 16),
                                child: const ErrorMessage(
                                    "Fehler beim Laden der Infos.")))
                        : AcceptingStoreSummary(
                            store: currentAcceptingStore,
                            showLocation: false,
                            key: ValueKey(currentAcceptingStore.id),
                            showMapButtonOnDetails: false))),
      ),
    );
  }
}
