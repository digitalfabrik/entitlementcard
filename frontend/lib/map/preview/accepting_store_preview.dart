import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql_gen/graphql_queries/stores/physical_store_by_id.graphql.dart';
import 'package:ehrenamtskarte/map/preview/accepting_store_preview_card.dart';
import 'package:ehrenamtskarte/map/preview/models.dart';
import 'package:flutter/material.dart';

class AcceptingStorePreview extends StatelessWidget {
  final int physicalStoreId;

  const AcceptingStorePreview({super.key, required this.physicalStoreId});

  @override
  Widget build(BuildContext context) {
    final projectId = Configuration.of(context).projectId;
    return Query$PhysicalStoreById$Widget(
      options: Options$Query$PhysicalStoreById(
        variables: Variables$Query$PhysicalStoreById(project: projectId, ids: [physicalStoreId]),
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

          final stores = fetchedData.stores;
          if (stores.length != 1) {
            throw Exception('Server unexpectedly returned an array of the wrong size.');
          }
          final store = stores[0];
          if (store == null) {
            throw Exception('ID not found.');
          }
          return AcceptingStorePreviewCard(
            isLoading: false,
            acceptingStore: _convertToAcceptingStoreModel(store),
          );
        } on Exception catch (e) {
          debugPrint(e.toString());
          return AcceptingStorePreviewCard(isLoading: false, refetch: refetch);
        }
      },
    );
  }

  AcceptingStoreModel _convertToAcceptingStoreModel(Query$PhysicalStoreById$stores item) {
    return AcceptingStoreModel(
      id: item.id,
      physicalStoreId: item.id,
      categoryId: item.store.category.id,
      name: item.store.name,
      // TODO: use localized description
      description: item.store.description,
      website: item.store.contact.website,
      telephone: item.store.contact.telephone,
      email: item.store.contact.email,
      street: item.address.street,
      postalCode: item.address.postalCode,
      location: item.address.location,
      coordinates: Coordinates(item.coordinates.lat, item.coordinates.lng),
    );
  }
}
