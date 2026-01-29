import 'package:ehrenamtskarte/category_assets.dart';
import 'package:flutter/material.dart';

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

class _FilterBarButtonState extends State<FilterBarButton> {
  bool _selected = false;

  @override
  Widget build(BuildContext context) {
    final color = widget.asset.color;
    final textColor = _selected
        ? (color!.computeLuminance() > 0.5 ? Colors.black : Colors.white)
        : Theme.of(context).textTheme.bodyMedium?.color;

    return FilterChip(
      avatar: ClipOval(
        child: Container(
          color: color,
          width: 26,
          height: 26,
          alignment: Alignment.center,
          child: Icon(widget.asset.icon, size: 18, color: Colors.white),
        ),
      ),
      label: Text(
        widget.asset.shortName,
        style: TextStyle(color: textColor),
      ),
      selected: _selected,
      shape: const StadiumBorder(),
      side: BorderSide(color: _selected ? Colors.transparent : Colors.grey),
      showCheckmark: false,
      selectedColor: color,
      backgroundColor: color!.withOpacity(0.1),
      visualDensity: const VisualDensity(vertical: -2),
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
      onSelected: (bool value) {
        setState(() {
          _selected = value;
          widget.onCategoryPress(widget.asset, value);
        });
      },
    );
  }
}
