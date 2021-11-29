import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

import '../category_assets.dart';

class FilterBarButton extends StatefulWidget {
  final CategoryAsset asset;
  final Function(CategoryAsset, bool) onCategoryPress;
  final int index;

  const FilterBarButton(
      {Key? key,
      required this.asset,
      required this.onCategoryPress,
      required this.index})
      : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _FilterBarButtonState();
  }
}

class _FilterBarButtonState extends State<FilterBarButton>
    with SingleTickerProviderStateMixin {
  bool _selected = false;
  AnimationController? _animationController;
  Animation? _colorTween;

  _FilterBarButtonState();

  @override
  void initState() {
    _animationController = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 400));

    super.initState();
  }

  @override
  void didChangeDependencies() {
    var animationController = _animationController;

    if (animationController != null) {
      _colorTween = ColorTween(
              begin: Theme.of(context).backgroundColor,
              end: Theme.of(context).primaryColorLight)
          .animate(animationController);
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
    const maxButtonWidth = 80.0;
    const paddingPerElement = 8;
    const minNumberElements = 5;

    // At least a width of 65 is needed to fit all category names
    const requiredCategoryLongTitleWidth = 65.0;

    var totalWidth = MediaQuery.of(context).size.width;

    var smallWidth = min(
        maxButtonWidth,
        // Width allowing at least minNumberElements in one row
        (totalWidth - minNumberElements * paddingPerElement) /
            minNumberElements);

    var largeWidth = max(requiredCategoryLongTitleWidth, smallWidth);

    var numLargeElementsPerRow = totalWidth ~/ largeWidth;
    var isSecondRow =
        widget.index >= max(minNumberElements, numLargeElementsPerRow);

    // In the second row we can use larger width as there are only 4 categories
    var width = isSecondRow ? largeWidth : smallWidth;

    var colorTween = _colorTween;
    var animationController = _animationController;
    if (colorTween == null || animationController == null) {
      return const Center();
    }

    return AnimatedBuilder(
        animation: colorTween,
        builder: (context, child) => RawMaterialButton(
            elevation: 0.0,
            shape: const RoundedRectangleBorder(
                borderRadius: BorderRadius.all(Radius.circular(5))),
            constraints: BoxConstraints.tightFor(width: width, height: 70),
            fillColor: colorTween.value,
            onPressed: () {
              var isSelected = !_selected;
              setState(() {
                _selected = isSelected;
                animationController.animateTo(isSelected ? 1 : 0);
                widget.onCategoryPress(widget.asset, isSelected);
              });
            },
            child: Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Column(children: [
                  SvgPicture.asset(widget.asset.icon,
                      width: 40.0, semanticsLabel: widget.asset.name),
                  Expanded(
                    child: Container(
                      alignment: Alignment.center,
                      child: Text(widget.asset.shortName,
                          maxLines: 2,
                          style: const TextStyle(fontSize: 10),
                          textAlign: TextAlign.center),
                    ),
                  )
                ]))));
  }
}
