import 'package:ehrenamtskarte/identification/id_card/card_content.dart';
import 'package:ehrenamtskarte/proto/card.pb.dart';
import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

/// Manually chosen aspect ratio of a card. Maybe this was determined using
/// a ruler?
const creditCardAspectRatio = 86 / 54;

class Region with EquatableMixin {
  final String prefix;
  final String name;

  Region(this.prefix, this.name);

  @override
  List<Object> get props => [prefix, name];
}

class IdCard extends StatelessWidget {
  final CardInfo cardInfo;
  final Region? region;
  final bool isExpired;
  final bool isNotYetValid;

  const IdCard({
    super.key,
    required this.cardInfo,
    required this.region,
    required this.isExpired,
    required this.isNotYetValid,
  });

  @override
  Widget build(BuildContext context) {
    final mediaQueryData = MediaQuery.of(context);
    return Card(
      elevation: 5,
      margin: EdgeInsets.zero,
      color: Colors.white,
      clipBehavior: Clip.antiAlias,
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxHeight: 600, maxWidth: 600),
        child: AspectRatio(
          aspectRatio: creditCardAspectRatio,
          child: MediaQuery(
            // Ignore text scale factor to enforce the same layout on all devices.
            data: mediaQueryData.copyWith(textScaler: TextScaler.linear(1)),
            child: CardContent(cardInfo: cardInfo, region: region, isExpired: isExpired, isNotYetValid: isNotYetValid),
          ),
        ),
      ),
    );
  }
}
