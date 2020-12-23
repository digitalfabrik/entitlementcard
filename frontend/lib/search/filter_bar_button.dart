import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

import '../category_assets.dart';

class FilterBarButton extends StatefulWidget {
  final int index;
  final Function(int, bool) onPress;

  FilterBarButton({Key key, this.index, this.onPress}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _FilterBarButtonState(index: this.index, onPress: this.onPress);
  }
}

class _FilterBarButtonState extends State<FilterBarButton> {
  final int index;
  bool _selected = false;
  final Function(int, bool) onPress;

  _FilterBarButtonState({this.index, this.onPress});

  @override
  Widget build(BuildContext context) {
    return new Material(
        color: this._selected ? Colors.blue : Colors.transparent,
        child: InkWell(
            splashColor: Colors.blue,
            onTap: () {
              this.onPress(this.index, this._selected);

              setState(() {
                this._selected = !this._selected;
              });
            },
            child: Container(
                child: Padding(
                    padding: const EdgeInsets.all(5.0),
                    child: Column(
                      children: [
                        SvgPicture.asset(categoryAssets[index]['icon'],
                            width: 40.0,
                            semanticsLabel: categoryAssets[index]['name']),
                        Container(
                          width: 50,
                          padding: const EdgeInsets.only(top: 3),
                          child: Text(categoryAssets[index]['name'],
                              style: TextStyle(fontSize: 10),
                              overflow: TextOverflow.ellipsis),
                        ),
                      ],
                    )))));
  }
}
