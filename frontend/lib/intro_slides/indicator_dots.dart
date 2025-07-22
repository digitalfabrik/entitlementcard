import 'package:flutter/material.dart';

class IndicatorDots extends StatelessWidget {
  final int numSlides;
  final void Function(int tabIndex) animateTo;

  /// Animation with a value between 0 and numTabs.
  final Animation<double> selectedIndexAnimation;

  const IndicatorDots({
    super.key,
    required this.numSlides,
    required this.animateTo,
    required this.selectedIndexAnimation,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final dotDiameter = 8.0;
    final inactiveColor = Colors.grey;
    final activeColor = theme.colorScheme.primary;
    // Each dot has a margin of `0.5*dotDiameter` in all directions, so the total size is...
    final size = Size(2 * dotDiameter * numSlides, 2 * dotDiameter);
    final activeDotTween = RelativeRectTween(
      // for selectedIndexAnimation.value == 0.0:
      begin: RelativeRect.fromSize(Rect.fromLTWH(dotDiameter / 2, dotDiameter / 2, dotDiameter, dotDiameter), size),
      // for selectedIndexAnimation.value == 1.0:
      end: RelativeRect.fromSize(Rect.fromLTWH(dotDiameter * 5 / 2, dotDiameter / 2, dotDiameter, dotDiameter), size),
      // for selectedIndexAnimation.value > 1.0, this linearly extrapolates correctly.
    );
    return SizedBox.fromSize(
      size: size,
      child: Stack(
        children: [
          // inactive dots
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(
              numSlides,
              (index) => InkWell(
                excludeFromSemantics: true,
                onTap: () => animateTo(index),
                child: Container(
                  height: dotDiameter,
                  width: dotDiameter,
                  margin: EdgeInsets.all(dotDiameter / 2),
                  decoration: BoxDecoration(color: inactiveColor, shape: BoxShape.circle),
                ),
              ),
            ),
          ),
          // animated, active dot on top
          PositionedTransition(
            rect: selectedIndexAnimation.drive(activeDotTween),
            child: Container(
              height: dotDiameter,
              width: dotDiameter,
              decoration: BoxDecoration(color: activeColor, shape: BoxShape.circle),
            ),
          ),
        ],
      ),
    );
  }
}
