import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql_gen/graphql_queries/stores/accepting_stores_by_physical_store_ids.graphql.dart';
import 'package:ehrenamtskarte/map/preview/accepting_store_preview_card.dart';
import 'package:ehrenamtskarte/map/preview/models.dart';
import 'package:ehrenamtskarte/store_widgets/store_description_helper.dart';
import 'package:flutter/material.dart';

class AcceptingStorePreview extends StatelessWidget {
  final int physicalStoreId;

  const AcceptingStorePreview({super.key, required this.physicalStoreId});

  @override
  Widget build(BuildContext context) {
    final projectId = Configuration.of(context).projectId;

    return Query$AcceptingStoresByPhysicalStoreIds$Widget(
      options: Options$Query$AcceptingStoresByPhysicalStoreIds(
        variables: Variables$Query$AcceptingStoresByPhysicalStoreIds(
          project: projectId,
          physicalStoreIds: [physicalStoreId],
        ),
      ),
      builder: (result, {refetch, fetchMore}) {
        try {
          final exception = result.exception;

          if (result.hasException && exception != null) {
            throw exception;
          }

          final fetchedData = result.parsedData;

          if (result.isLoading || fetchedData == null) {
            return const AcceptingStorePreviewCard(isLoading: true);
          }

          final store = fetchedData.acceptingStoresByPhysicalStoreIdsInProject.firstOrNull;
          if (store == null) {
            throw Exception('ID not found.');
          }
          return AcceptingStorePreviewCard(isLoading: false, acceptingStore: _convertToAcceptingStoreModel(store));
        } on Exception catch (e) {
          debugPrint(e.toString());
          return AcceptingStorePreviewCard(isLoading: false, refetch: refetch);
        }
      },
    );
  }

  AcceptingStoreModel _convertToAcceptingStoreModel(
    Query$AcceptingStoresByPhysicalStoreIds$acceptingStoresByPhysicalStoreIdsInProject item,
  ) {
    return AcceptingStoreModel(
      id: item.id,
      physicalStoreId: item.physicalStore?.id ?? physicalStoreId,
      categoryId: item.categoryId,
      name: item.name,
      description: getLocalizedDescription(item.descriptions),
      website: item.contact.website,
      telephone: item.contact.telephone,
      email: item.contact.email,
      street: item.physicalStore?.address.street,
      postalCode: item.physicalStore?.address.postalCode,
      location: item.physicalStore?.address.location,
      coordinates: item.physicalStore != null
          ? Coordinates(item.physicalStore!.coordinates.lat, item.physicalStore!.coordinates.lng)
          : null,
    );
  }
}
