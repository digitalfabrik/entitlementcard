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

class _FilterBarButtonState extends State<FilterBarButton> {
  bool _selected = false;

  _FilterBarButtonState();

  @override
  Widget build(BuildContext context) {
    return new Material(
        color:
            this._selected ? Theme.of(context).accentColor : Colors.transparent,
        child: InkWell(
            splashColor: Theme.of(context).accentColor,
            onTap: () {
              var isSelected = !this._selected;
              setState(() {
                this._selected = isSelected;
              });

              this.widget.onCategoryPress(this.widget.asset, isSelected);
            },
            child: Container(
                child: Padding(
                    padding: const EdgeInsets.all(5.0),
                    child: Column(
                      children: [
                        SvgPicture.asset(this.widget.asset.icon,
                            width: 40.0,
                            semanticsLabel: this.widget.asset.name),
                        Container(
                          width: 50,
                          padding: const EdgeInsets.only(top: 3),
                          child: Text(this.widget.asset.name,
                              style: TextStyle(fontSize: 10),
                              overflow: TextOverflow.ellipsis),
                        ),
                      ],
                    )))));
  }
}
