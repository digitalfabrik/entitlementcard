import 'dart:math';

import 'package:ehrenamtskarte/category_assets.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:tinycolor2/tinycolor2.dart';

class FilterBarButton extends StatefulWidget {
  final CategoryAsset asset;
  final void Function(CategoryAsset, bool) onCategoryPress;
  final int index;

  const FilterBarButton({super.key, required this.asset, required this.onCategoryPress, required this.index});

  @override
  State<StatefulWidget> createState() {
    return _FilterBarButtonState();
  }
}

class _FilterBarButtonState extends State<FilterBarButton> with SingleTickerProviderStateMixin {
  bool _selected = false;
  AnimationController? _animationController;
  Animation<double>? _colorTween;

  _FilterBarButtonState();

  @override
  void initState() {
    _animationController = AnimationController(vsync: this, duration: const Duration(milliseconds: 200));

    super.initState();
  }

  @override
  void didChangeDependencies() {
    final animationController = _animationController;

    if (animationController != null) {
      _colorTween = Tween<double>(begin: 0, end: 1).animate(animationController);
      super.didChangeDependencies();
    }
  }

  @override
  void dispose() {
    super.dispose();
    _animationController?.dispose();
  }

  @override
  Widget build(BuildContext context) {
    // At least a width of 65 is needed to fit all category names
    const requiredTitleWidth = 65.0;
    const maxElementWidth = 80.0;
    const paddingPerElement = 8;
    const minNumberElements = 5;
    final totalWidth = MediaQuery.of(context).size.width;

    final totalWidthWithoutPadding = totalWidth - minNumberElements * paddingPerElement;
    final availableElementWidth = totalWidthWithoutPadding / minNumberElements;

    final smallWidth = min(maxElementWidth, availableElementWidth);
    final largeWidth = max(requiredTitleWidth, smallWidth);

    final numSmallElementsPerRow = totalWidth ~/ smallWidth;
    final numElementsFirstRow = max(minNumberElements, numSmallElementsPerRow);
    final isSecondRow = widget.index >= numElementsFirstRow;

    // In the second row we can use larger width as there are only 4 categories
    final width = isSecondRow ? largeWidth : smallWidth;

    final theme = Theme.of(context);

    final selectedColor = theme.brightness == Brightness.dark
        ? theme.colorScheme.primary.toHSLColor().withLightness(0.2).toColor()
        : theme.colorScheme.primary.toHSLColor().withLightness(0.9).toColor();

    final colorTween = _colorTween;
    final animationController = _animationController;
    if (colorTween == null || animationController == null) {
      return const Center();
    }

    return AnimatedBuilder(
      animation: colorTween,
      builder: (context, child) {
        final color = Color.lerp(theme.colorScheme.surface, selectedColor, colorTween.value);
        return ConstrainedBox(
          constraints: BoxConstraints.tightFor(width: width, height: 74),
          child: Card(
            margin: EdgeInsets.zero,
            color: color,
            elevation: 0,
            clipBehavior: Clip.hardEdge,
            child: InkWell(
              onTap: () {
                final isSelected = !_selected;
                setState(() {
                  _selected = isSelected;
                  animationController.animateTo(isSelected ? 1 : 0);
                  widget.onCategoryPress(widget.asset, isSelected);
                });
              },
              child: Column(
                children: [
                  SvgPicture.asset(widget.asset.icon, width: 40.0, semanticsLabel: widget.asset.name),
                  Expanded(
                    child: Container(
                      alignment: Alignment.topCenter,
                      child: Text(
                        widget.asset.shortName,
                        maxLines: 2,
                        style: theme.textTheme.labelSmall,
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
