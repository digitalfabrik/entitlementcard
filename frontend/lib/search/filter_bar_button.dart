import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

import '../category_assets.dart';

class FilterBarButton extends StatefulWidget {
  final CategoryAsset asset;
  final Function(CategoryAsset, bool) onCategoryPress;

  FilterBarButton({Key key, this.asset, this.onCategoryPress})
      : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _FilterBarButtonState();
  }
}

class _FilterBarButtonState extends State<FilterBarButton>
    with SingleTickerProviderStateMixin {
  bool _selected = false;
  AnimationController _animationController;
  Animation _colorTween;

  _FilterBarButtonState();

  @override
  void initState() {
    _animationController =
        AnimationController(vsync: this, duration: Duration(milliseconds: 400));

    super.initState();
  }

  @override
  void didChangeDependencies() {
    _colorTween = ColorTween(
            begin: Theme.of(context).backgroundColor,
            end: Theme.of(context).primaryColorLight)
        .animate(_animationController);
    super.didChangeDependencies();
  }

  @override
  void dispose() {
    super.dispose();
    _animationController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
        animation: _colorTween,
        builder: (context, child) => RawMaterialButton(
            elevation: 0.0,
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.all(Radius.circular(5))),
            constraints: BoxConstraints(
                minWidth: 80, maxWidth: 80, minHeight: 70, maxHeight: 70),
            fillColor: _colorTween.value,
            onPressed: () {
              var isSelected = !_selected;
              setState(() {
                _selected = isSelected;
                _animationController.animateTo(isSelected ? 1 : 0);
                widget.onCategoryPress(widget.asset, isSelected);
              });
            },
            child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 5),
                child: Column(children: [
                  SvgPicture.asset(widget.asset.icon,
                      width: 40.0, semanticsLabel: widget.asset.name),
                  Padding(
                    padding: const EdgeInsets.only(top: 3),
                    child: Text(widget.asset.shortName,
                        maxLines: 2,
                        style: TextStyle(fontSize: 10),
                        textAlign: TextAlign.center),
                  ),
                ]))));
  }
}
