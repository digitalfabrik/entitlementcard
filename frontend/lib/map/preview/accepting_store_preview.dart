import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql_gen/graphql_queries/stores/accepting_store_by_physical_store_id.graphql.dart';
import 'package:ehrenamtskarte/map/preview/accepting_store_preview_card.dart';
import 'package:ehrenamtskarte/map/preview/models.dart';
import 'package:flutter/material.dart';

class AcceptingStorePreview extends StatelessWidget {
  final int physicalStoreId;

  const AcceptingStorePreview({super.key, required this.physicalStoreId});

  @override
  Widget build(BuildContext context) {
    final projectId = Configuration.of(context).projectId;
    
    return Query$AcceptingStoreByPhysicalStoreId$Widget(
      options: Options$Query$AcceptingStoreByPhysicalStoreId(
        variables: Variables$Query$AcceptingStoreByPhysicalStoreId(project: projectId, physicalStoreId: physicalStoreId),
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

          final store = fetchedData.store;
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

  AcceptingStoreModel _convertToAcceptingStoreModel(Query$AcceptingStoreByPhysicalStoreId$store item) {
    return AcceptingStoreModel(
      id: item.id,
      physicalStoreId: item.physicalStore?.id ?? physicalStoreId,
      categoryId: item.categoryId,
      name: item.name,
      // TODO: use localized description
      description: item.descriptions?.firstOrNull?.text,
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
