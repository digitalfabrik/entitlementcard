import 'package:ehrenamtskarte/identification/card_detail_view/rectangular_progress_indicator_painter.dart';
import 'package:flutter/material.dart';

class AnimatedProgressbar extends StatefulWidget {
  final Duration initialProgress;
  static const Duration totalDuration = Duration(seconds: 30);

  const AnimatedProgressbar({super.key, required this.initialProgress});

  @override
  AnimatedProgressbarState createState() => AnimatedProgressbarState();
}

class AnimatedProgressbarState extends State<AnimatedProgressbar> with SingleTickerProviderStateMixin {
  late AnimationController controller;
  late Animation<double> animation;

  @override
  void initState() {
    super.initState();
    final beginValue = 1 - widget.initialProgress.inMicroseconds / AnimatedProgressbar.totalDuration.inMicroseconds;
    controller = AnimationController(duration: AnimatedProgressbar.totalDuration, vsync: this)
      ..addListener(() => setState(() {}))
      ..value = beginValue;
    animation = Tween(begin: 1.0, end: 0.0).animate(controller);
    controller.repeat();
  }

  @override
  void didUpdateWidget(AnimatedProgressbar oldWidget) {
    super.didUpdateWidget(oldWidget);
    controller.value = 1 - widget.initialProgress.inMicroseconds / AnimatedProgressbar.totalDuration.inMicroseconds;
    controller.repeat();
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: RectangularProgressIndicatorPainter(
        valueColor: Theme.of(context).colorScheme.secondary,
        value: animation.value,
      ),
    );
  }
}
