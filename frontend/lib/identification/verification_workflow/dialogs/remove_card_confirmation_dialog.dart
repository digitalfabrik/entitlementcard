import 'package:carousel_slider/carousel_controller.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql/graphql_api.dart';
import 'package:ehrenamtskarte/identification/id_card/id_card.dart';
import 'package:ehrenamtskarte/identification/user_code_model.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:provider/provider.dart';

class RemoveCardConfirmationDialog extends StatefulWidget {
  final DynamicUserCode userCode;
  final CarouselController carouselController;

  const RemoveCardConfirmationDialog({super.key, required this.userCode, required this.carouselController});

  static Future<void> show(
          {required BuildContext context,
          required DynamicUserCode userCode,
          required CarouselController carouselController}) =>
      showDialog(
        context: context,
        builder: (_) => RemoveCardConfirmationDialog(userCode: userCode, carouselController: carouselController),
      );

  @override
  RemoveCardConfirmationDialogState createState() => RemoveCardConfirmationDialogState();
}

class RemoveCardConfirmationDialogState extends State<RemoveCardConfirmationDialog> {
  @override
  Widget build(BuildContext context) {
    final localization = buildConfig.localization.identification.removeCardDialog;
    final projectId = Configuration.of(context).projectId;
    final regionsQuery = GetRegionsByIdQuery(
      variables: GetRegionsByIdArguments(
        project: projectId,
        ids: [widget.userCode.info.extensions.extensionRegion.regionId],
      ),
    );

    return Query(
      options: QueryOptions(document: regionsQuery.document, variables: regionsQuery.getVariablesMap()),
      builder: (result, {refetch, fetchMore}) {
        final data = result.data;
        final theme = Theme.of(context);
        final region = result.isConcrete && data != null ? regionsQuery.parse(data).regionsByIdInProject[0] : null;
        return AlertDialog(
          titlePadding: EdgeInsets.all(4),
          contentPadding: EdgeInsets.only(left: 24, right: 24),
          actionsPadding: EdgeInsets.only(left: 24, right: 24, top: 12, bottom: 12),
          title: ListTile(
            leading: Icon(Icons.warning, color: theme.colorScheme.primaryContainer, size: 30),
            title: Text(localization.title, style: TextStyle(fontSize: 18)),
          ),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Padding(
                    padding: EdgeInsets.only(bottom: 20),
                    child: Text(localization.description, style: TextStyle(fontSize: 14))),
                IdCard(
                  cardInfo: widget.userCode.info,
                  region: region != null ? Region(region.prefix, region.name) : null,
                  // We trust the backend to have checked for expiration.
                  isExpired: false,
                  isNotYetValid: false,
                ),
              ],
            ),
          ),
          actions: <Widget>[
            TextButton(
              child: const Text('Abbrechen'),
              onPressed: () {
                Navigator.of(context).pop(false);
              },
            ),
            TextButton(
              child: const Text('Löschen'),
              onPressed: () {
                final provider = Provider.of<UserCodeModel>(context, listen: false);
                if (provider.userCodes.length == 1) {
                  provider.removeCodes();
                } else {
                  provider.removeCode(widget.userCode);
                  widget.carouselController.previousPage(duration: Duration(milliseconds: 500), curve: Curves.linear);
                }
                Navigator.of(context).pop(true);
              },
            ),
          ],
        );
      },
    );
  }
}
