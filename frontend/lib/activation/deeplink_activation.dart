import 'dart:convert';

import 'package:ehrenamtskarte/app.dart';
import 'package:ehrenamtskarte/build_config/build_config.dart' show buildConfig;
import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/graphql/graphql_api.graphql.dart';
import 'package:ehrenamtskarte/home/home_page.dart';
import 'package:ehrenamtskarte/identification/activation_workflow/activation_code_parser.dart';
import 'package:ehrenamtskarte/identification/qr_code_scanner/qr_code_processor.dart';
import 'package:ehrenamtskarte/identification/user_code_model.dart';
import 'package:ehrenamtskarte/identification/util/activate_card.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:provider/provider.dart';
import 'package:ehrenamtskarte/identification/id_card/id_card.dart';
import 'package:ehrenamtskarte/graphql/graphql_api.dart';

enum DeepLinkActivationStatus {
  // Link is invalid
  invalidLink,
  // The card already exists on the device.
  alreadyExists,
  // The card limit is reached on the device.
  limitReached,
  // The card can be activated
  valid;

  factory DeepLinkActivationStatus.from(UserCodeModel userCodeModel, DynamicActivationCode? activationCode) {
    if (activationCode == null) {
      return DeepLinkActivationStatus.invalidLink;
    } else if (isAlreadyInList(userCodeModel.userCodes, activationCode.info)) {
      return DeepLinkActivationStatus.alreadyExists;
    } else if (hasReachedCardLimit(userCodeModel.userCodes)) {
      return DeepLinkActivationStatus.limitReached;
    } else {
      return DeepLinkActivationStatus.valid;
    }
  }
}

class DeepLinkActivation extends StatelessWidget {
  final String base64qrcode;

  const DeepLinkActivation({super.key, required this.base64qrcode});

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    DynamicActivationCode? activationCode = getActivationCode(context, base64qrcode);
    CardInfo? cardInfo = activationCode?.info;
    final userCodeModel = Provider.of<UserCodeModel>(context, listen: false);
    final status = DeepLinkActivationStatus.from(userCodeModel, activationCode);
    final regionId = cardInfo?.extensions.extensionRegion.regionId ?? -1;
    final regionsQuery = GetRegionsByIdQuery(
      variables: GetRegionsByIdArguments(
        project: Configuration.of(context).projectId,
        ids: [regionId],
      ),
    );

    final String cardsInUse = userCodeModel.userCodes.length.toString();
    final String maxCardAmount = buildConfig.maxCardAmount.toString();
    final theme = Theme.of(context);

    return Query(
        options: QueryOptions(document: regionsQuery.document, variables: regionsQuery.getVariablesMap()),
        builder: (result, {refetch, fetchMore}) {
          final data = result.data;
          final region = result.isConcrete && data != null ? regionsQuery.parse(data).regionsByIdInProject[0] : null;

          return Scaffold(
            appBar: AppBar(
              title: Text(t.deeplinkActivation.headline),
              leading: BackButton(onPressed: () => {GoRouter.of(context).pop()}),
            ),
            body: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(20),
                      child: status == DeepLinkActivationStatus.invalidLink
                          ? null
                          : Text(t.deeplinkActivation.description,
                              style: theme.textTheme.headlineSmall, textAlign: TextAlign.center),
                    ),
                    Center(
                        child: cardInfo != null
                            ? IdCard(
                                cardInfo: cardInfo,
                                region: region != null ? Region(region.prefix, region.name) : null,
                                // We trust the backend to have checked for expiration.
                                isExpired: false,
                                isNotYetValid: false,
                              )
                            : null),
                    Padding(
                      padding: const EdgeInsets.all(32),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          ...switch (status) {
                            DeepLinkActivationStatus.invalidLink => [_WarningText(t.deeplinkActivation.invalidCode)],
                            DeepLinkActivationStatus.limitReached => [
                                _WarningText('${t.deeplinkActivation.limitReached} ($cardsInUse/$maxCardAmount)')
                              ],
                            DeepLinkActivationStatus.alreadyExists => [
                                _WarningText(t.deeplinkActivation.alreadyExists)
                              ],
                            DeepLinkActivationStatus.valid => [
                                ElevatedButton(
                                  onPressed: activationCode != null
                                      ? () {
                                          activateCard(
                                              context,
                                              () => GoRouter.of(context)
                                                  .pushReplacement('$homeRouteName/$identityTabIndex'),
                                              activationCode);
                                        }
                                      : null,
                                  child: Text(t.deeplinkActivation.buttonText),
                                )
                              ],
                          },
                        ],
                      ),
                    ),
                  ],
                )),
          );
        });
  }
}

class _WarningText extends StatelessWidget {
  final String text;

  const _WarningText(this.text);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(Icons.warning, color: Theme.of(context).colorScheme.secondary),
        Text(text, textAlign: TextAlign.center)
      ],
    );
  }
}

DynamicActivationCode? getActivationCode(BuildContext context, String base64qrcode) {
  try {
    final activationCode = const ActivationCodeParser().parseQrCodeContent(const Base64Decoder().convert(base64qrcode));
    return activationCode;
  } on QrCodeParseException catch (e, _) {
    debugPrint('Der Aktivierungscode ist ungültig.');
    return null;
  } on FormatException catch (e, _) {
    debugPrint('Das Format des Aktivierungscodes ist ungültig.');
    return null;
  }
}
