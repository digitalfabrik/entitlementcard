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
    final textColor = Theme.of(context).textTheme.bodyMedium?.color;

    return FilterChip(
      avatarBoxConstraints: const BoxConstraints.tightFor(width: 28, height: 28),
      avatar: ClipOval(
        child: Container(
          color: color,
          width: 28,
          height: 28,
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
      side: BorderSide(color: _selected ? Colors.transparent : Colors.grey.shade200),
      showCheckmark: false,
      selectedColor: color!.withOpacity(0.3),
      backgroundColor: Colors.grey.shade100,
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 0),
      visualDensity: VisualDensity.standard,
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
