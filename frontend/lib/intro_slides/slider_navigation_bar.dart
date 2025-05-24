import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/intro_slides/indicator_dots.dart';

class SliderNavigationBar extends StatelessWidget {
  final int currentIndex;
  final int length;
  final Animation<double> tabBarAnimation;
  final Function(int) animateTo;
  final VoidCallback? onDonePressed;

  const SliderNavigationBar(
      {super.key,
      required this.currentIndex,
      required this.length,
      required this.tabBarAnimation,
      required this.animateTo,
      required this.onDonePressed});

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final buttonLeft = _CustomAnimatedSwitcher(
      child: currentIndex > 0
          ? TextButton(
              key: Key('previous'),
              child: Text(t.common.previous),
              onPressed: () {
                animateTo(currentIndex - 1);
              },
            )
          : Container(),
    );

    final buttonRight = TextButton(
      child: _CustomAnimatedSwitcher(
          child: currentIndex == length - 1
              ? Text(t.common.done, key: Key('done'))
              : Text(t.common.next, key: Key('next'))),
      onPressed: currentIndex == length - 1 ? onDonePressed : () => animateTo(currentIndex + 1),
    );

    return SafeArea(
      child: Row(
        mainAxisSize: MainAxisSize.max,
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          Expanded(child: buttonLeft),
          Expanded(
            child: Center(
              child: IndicatorDots(
                numSlides: length,
                animateTo: animateTo,
                selectedIndexAnimation: tabBarAnimation,
              ),
            ),
          ),
          Expanded(child: buttonRight)
        ],
      ),
    );
  }
}

class _CustomAnimatedSwitcher extends StatelessWidget {
  final Widget child;

  const _CustomAnimatedSwitcher({required this.child});

  @override
  Widget build(BuildContext context) {
    return AnimatedSwitcher(
      duration: Duration(milliseconds: 200),
      layoutBuilder: (currentChild, previousChildren) => Stack(
        alignment: Alignment.center,
        fit: StackFit.passthrough,
        children: [
          ...previousChildren,
          if (currentChild != null) currentChild,
        ],
      ),
      child: child,
    );
  }
}
