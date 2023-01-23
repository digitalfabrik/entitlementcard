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

  const IdCard({super.key, required this.cardInfo, required this.region});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 5,
      margin: EdgeInsets.zero,
      color: Colors.white,
      clipBehavior: Clip.antiAlias,
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxHeight: 600, maxWidth: 600),
        child: AspectRatio(
          aspectRatio: creditCardAspectRatio,
          child: CardContent(
            cardInfo: cardInfo,
            region: region,
          ),
        ),
      ),
    );
  }
}
