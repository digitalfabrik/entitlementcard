import 'package:ehrenamtskarte/map/floating_action_map_bar.dart';
import 'package:ehrenamtskarte/map/preview/models.dart';
import 'package:ehrenamtskarte/store_widgets/accepting_store_summary.dart';
import 'package:ehrenamtskarte/widgets/error_message.dart';
import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class AcceptingStorePreviewError extends StatelessWidget {
  final void Function()? refetch;
  final String? errorMessage;

  const AcceptingStorePreviewError({super.key, this.refetch, this.errorMessage});

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    return InkWell(
      onTap: refetch,
      child: Container(
        height: double.infinity,
        padding: const EdgeInsets.all(12),
        child: ErrorMessage(message: errorMessage ?? t.store.loadingDataFailed, canRefetch: refetch != null),
      ),
    );
  }
}

class AcceptingStorePreviewCard extends StatelessWidget {
  final bool isLoading;
  final void Function()? refetch;
  final AcceptingStoreModel? acceptingStore;
  final String? errorMessage;

  const AcceptingStorePreviewCard({
    super.key,
    required this.isLoading,
    this.acceptingStore,
    this.refetch,
    this.errorMessage,
  });

  @override
  Widget build(BuildContext context) {
    final currentAcceptingStore = acceptingStore;
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: fabPadding.toDouble()),
      child: Card(
        clipBehavior: Clip.hardEdge,
        margin: EdgeInsets.zero,
        color: Theme.of(context).colorScheme.surfaceContainerHighest,
        surfaceTintColor: Colors.transparent,
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 200),
          child: isLoading
              ? Container(padding: const EdgeInsets.symmetric(horizontal: 40), child: const LinearProgressIndicator())
              : currentAcceptingStore == null
              ? AcceptingStorePreviewError(refetch: refetch, errorMessage: errorMessage)
              : AcceptingStoreSummary(
                  store: currentAcceptingStore,
                  showLocation: false,
                  key: ValueKey(currentAcceptingStore.physicalStoreId),
                  showOnMap: null,
                ),
        ),
      ),
    );
  }
}
