import 'package:ehrenamtskarte/intro_slides/slider_navigation_bar.dart';
import 'package:flutter/material.dart';

class DecoratedSlider extends StatefulWidget {
  final VoidCallback? onDonePressed;
  final List<Widget> children;

  const DecoratedSlider({super.key, required this.onDonePressed, required this.children});

  @override
  State<DecoratedSlider> createState() => _DecoratedSliderState();
}

class _DecoratedSliderState extends State<DecoratedSlider> with TickerProviderStateMixin {
  late TabController controller = TabController(length: widget.children.length, vsync: this);

  @override
  void initState() {
    super.initState();
    initController();
  }

  void initController() {
    controller.addListener(() {
      setState(() {
        // We should rebuild on changes to `controller.index`,
        // because we pass the index to TabNavigationBar.
      });
    });
  }

  @override
  void didUpdateWidget(covariant DecoratedSlider oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.children.length != widget.children.length) {
      // We have to reconstruct the controller, as it cannot change its length.
      controller.dispose();
      controller = TabController(length: widget.children.length, vsync: this);
      initController();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      Expanded(
        child: TabBarView(
          controller: controller,
          children: widget.children,
        ),
      ),
      MediaQuery.removePadding(
        removeTop: true,
        context: context,
        child: SliderNavigationBar(
            currentIndex: controller.index,
            length: widget.children.length,
            tabBarAnimation: controller.animation!,
            animateTo: controller.animateTo,
            onDonePressed: widget.onDonePressed),
      )
    ]);
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }
}
