import 'package:flutter/material.dart';

/// Center and radius of the dot inside the lens of [Icons.search], based on the 24x24 icon grid
const _lensCenter = 9.5;
const _dotRadius = 2.5;

/// [Icons.search] with a filled dot in the lens, used as selected icon as there is no filled variant
class FilledSearchIcon extends StatelessWidget {
  const FilledSearchIcon({super.key});

  @override
  Widget build(BuildContext context) {
    final iconTheme = IconTheme.of(context);
    final size = iconTheme.size ?? 24;
    final scale = size / 24;

    return SizedBox.square(
      dimension: size,
      child: Stack(
        children: [
          const Icon(Icons.search),
          Positioned(
            left: (_lensCenter - _dotRadius) * scale,
            top: (_lensCenter - _dotRadius) * scale,
            child: Container(
              width: 2 * _dotRadius * scale,
              height: 2 * _dotRadius * scale,
              decoration: BoxDecoration(color: iconTheme.color, shape: BoxShape.circle),
            ),
          ),
        ],
      ),
    );
  }
}
