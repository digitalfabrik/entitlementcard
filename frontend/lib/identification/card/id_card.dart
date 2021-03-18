import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

final creditCardAspectRatio = 86 / 54;

class IdCard extends StatelessWidget {
  final Widget child;
  final double height;

  const IdCard({Key key, this.child, this.height}) : super(key: key);

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
            constraints: BoxConstraints(maxHeight: 600, maxWidth: 600),
            child:
                AspectRatio(aspectRatio: creditCardAspectRatio, child: child)));
  }
}
