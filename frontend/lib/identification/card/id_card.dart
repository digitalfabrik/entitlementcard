import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

/// Manually chosen aspect ratio of a card. Maybe this was determined using
/// a ruler?
const creditCardAspectRatio = 86 / 54;

class IdCard extends StatelessWidget {
  final Widget child;

  const IdCard({Key? key, required this.child}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 5,
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10.0),
      ),
      clipBehavior: Clip.antiAlias,
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxHeight: 600, maxWidth: 600),
        child: AspectRatio(aspectRatio: creditCardAspectRatio, child: child),
      ),
    );
  }
}
