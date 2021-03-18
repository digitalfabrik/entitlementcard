import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';

import 'rectangular_progress_indicator_painter.dart';

class AnimatedProgressbar extends StatefulWidget {
  final Duration duration;
  static Duration totalDuration = Duration(seconds: 30);
  final VoidCallback onCompleted;

  const AnimatedProgressbar({Key key, this.duration, this.onCompleted})
      : super(key: key);

  @override
  _AnimatedProgressbarState createState() => _AnimatedProgressbarState();
}

class _AnimatedProgressbarState extends State<AnimatedProgressbar>
    with SingleTickerProviderStateMixin {
  AnimationController controller;
  Animation<double> animation;

  @override
  void initState() {
    super.initState();
    if (widget.duration.inMicroseconds > 0) {
      controller = AnimationController(
          duration: AnimatedProgressbar.totalDuration, vsync: this);
      var beginValue = 1 -
          widget.duration.inMicroseconds /
              AnimatedProgressbar.totalDuration.inMicroseconds;
      animation = Tween(begin: 1.0, end: 0.0).animate(controller)
        ..addListener(() {
          setState(() {});
        })
        ..addStatusListener((status) {
          if (status == AnimationStatus.completed) {
            if (widget.onCompleted != null) widget.onCompleted();
          }
        });
      controller.value = beginValue;
      controller.forward();
    }
  }

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: RectangularProgressIndicatorPainter(
        valueColor: Theme.of(context).accentColor,
        value: animation?.value ?? 0.0,
      ),
    );
  }
}
