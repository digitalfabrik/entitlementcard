import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql_gen/graphql_queries/regions/get_regions_by_id.graphql.dart';
import 'package:ehrenamtskarte/identification/id_card/id_card.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter/cupertino.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class IdCardWithRegionQuery extends StatelessWidget {
  final CardInfo cardInfo;
  final bool isExpired;
  final bool isNotYetValid;

  const IdCardWithRegionQuery({
    super.key,
    required this.cardInfo,
    required this.isExpired,
    required this.isNotYetValid,
  });

  @override
  Widget build(BuildContext context) {
    final projectId = Configuration.of(context).projectId;
    final exts = cardInfo.extensions;
    final regionId = exts.hasExtensionRegion() ? exts.extensionRegion.regionId : null;

    if (regionId == null) {
      return IdCard(cardInfo: cardInfo, region: null, isExpired: isExpired, isNotYetValid: isNotYetValid);
    }

    return Query$getRegionsById$Widget(
      options: Options$Query$getRegionsById(
        fetchPolicy: FetchPolicy.cacheFirst,
        variables: Variables$Query$getRegionsById(project: projectId, ids: [regionId]),
      ),
      builder: (result, {refetch, fetchMore}) {
        final fetchedData = result.parsedData;

        final region = result.isLoading || result.hasException || fetchedData == null ? null : fetchedData.regions[0];
        return IdCard(
          cardInfo: cardInfo,
          region: region != null ? Region(region.prefix, region.name) : null,
          isExpired: isExpired,
          isNotYetValid: isNotYetValid,
        );
      },
    );
  }
}
