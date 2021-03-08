import 'package:flutter/material.dart';

class AnimatedProgressbar extends StatefulWidget {
  final Duration duration;
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
    if (widget.duration.inSeconds > 0) {
      controller = AnimationController(duration: widget.duration, vsync: this);
      animation = Tween(begin: 1.0, end: 0.0).animate(controller)
        ..addListener(() {
          setState(() {});
        })
        ..addStatusListener((status) {
          if (status == AnimationStatus.completed) {
            if (widget.onCompleted != null) widget.onCompleted();
          }
          ;
        });
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
    return LinearProgressIndicator(
      value: animation?.value ?? 0,
    );
  }
}
