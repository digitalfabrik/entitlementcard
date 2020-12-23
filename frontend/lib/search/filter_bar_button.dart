import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

import '../category_assets.dart';

class FilterBarButton extends StatefulWidget {
  final CategoryAsset asset;
  final Function(CategoryAsset, bool) onCategoryPress;

  FilterBarButton({Key key, this.asset, this.onCategoryPress}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _FilterBarButtonState(asset: this.asset, onCategoryPress: this.onCategoryPress);
  }
}

class _FilterBarButtonState extends State<FilterBarButton> {
  final CategoryAsset asset;
  final Function(CategoryAsset, bool) onCategoryPress;
  
  bool _selected = false;

  _FilterBarButtonState({this.asset, this.onCategoryPress});

  @override
  Widget build(BuildContext context) {
    return new Material(
        color: this._selected ? Colors.blue : Colors.transparent,
        child: InkWell(
            splashColor: Colors.blue,
            onTap: () {
              var isSelected = !this._selected;
              setState(() {
                this._selected = isSelected;
              });

              this.onCategoryPress(this.asset, isSelected);
            },
            child: Container(
                child: Padding(
                    padding: const EdgeInsets.all(5.0),
                    child: Column(
                      children: [
                        SvgPicture.asset(this.asset.icon,
                            width: 40.0,
                            semanticsLabel: this.asset.name),
                        Container(
                          width: 50,
                          padding: const EdgeInsets.only(top: 3),
                          child: Text(this.asset.name,
                              style: TextStyle(fontSize: 10),
                              overflow: TextOverflow.ellipsis),
                        ),
                      ],
                    )))));
  }
}
