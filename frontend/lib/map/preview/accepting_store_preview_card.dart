import 'package:ehrenamtskarte/home/floating_action_map_bar.dart';
import 'package:flutter/material.dart';

import '../../store_widgets/accepting_store_summary.dart';
import '../../widgets/error_message.dart';
import 'models.dart';

class AcceptingStorePreviewError extends StatelessWidget {
  final void Function()? refetch;

  const AcceptingStorePreviewError({Key? key, this.refetch}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InkWell(
        onTap: refetch,
        child: Container(
            height: double.infinity,
            padding:
            const EdgeInsets.symmetric(horizontal: 16),
            child: const ErrorMessage(
                "Fehler beim Laden der Infos.")));
  }
}

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
        padding: EdgeInsets.symmetric(horizontal: fabPadding.toDouble()),
        child: Card(
            margin: const EdgeInsets.all(0),
            child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 200),
                child: isLoading
                    ? Container(
                    padding: const EdgeInsets.symmetric(horizontal: 40),
                    child: const LinearProgressIndicator())
                    : currentAcceptingStore == null
                    ? AcceptingStorePreviewError(refetch: refetch)
                    : AcceptingStoreSummary(
                    store: currentAcceptingStore,
                    showLocation: false,
                    key: ValueKey(currentAcceptingStore.id),
                    showMapButtonOnDetails: false))));
  }
}
