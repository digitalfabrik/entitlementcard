import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../category_assets.dart';
import '../debouncer.dart';
import '../graphql/graphql_api.graphql.dart';
import 'filter_bar.dart';
import 'location_button.dart';
import 'results_loader.dart';

class SearchPage extends StatefulWidget {
  const SearchPage({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  String? _searchFieldText;
  final TextEditingController _textEditingController = TextEditingController();
  final List<CategoryAsset> _selectedCategories = [];
  final _debouncer = Debouncer(delay: const Duration(milliseconds: 50));
  final FocusNode _focusNode = FocusNode();
  CoordinatesInput? _coordinates;

  @override
  void dispose() {
    super.dispose();
    _textEditingController.dispose();
    _focusNode.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const appBarTextStyle = TextStyle(color: Colors.white);
    var textEditingController = _textEditingController;
    var searchFieldText = _searchFieldText;
    var currentCoordinatesInput = _coordinates;
    return Stack(children: [
      CustomScrollView(
        slivers: [
          SliverAppBar(
            title: TextField(
              onChanged: _onSearchFieldTextChanged,
              controller: textEditingController,
              focusNode: _focusNode,
              decoration: const InputDecoration.collapsed(
                hintText: "Tippen, um zu suchen …",
                hintStyle: appBarTextStyle,
              ),
              cursorColor: Colors.white,
              style: appBarTextStyle,
            ),
            pinned: true,
            actions: [
              if (textEditingController.value.text.isNotEmpty)
                IconButton(
                    icon: const Icon(Icons.clear), onPressed: _clearInput),
              IconButton(
                icon: const Icon(Icons.search),
                onPressed: _onSearchPressed,
              )
            ],
          ),
          FilterBar(onCategoryPress: _onCategoryPress),
          SliverToBoxAdapter(
              child: Padding(
                  padding: const EdgeInsets.all(8),
                  child: Row(children: [
                    Text(
                      "Suchresultate".toUpperCase(),
                      style: const TextStyle(color: Colors.grey),
                    ),
                    const Expanded(
                        child: Padding(
                            padding: EdgeInsets.only(left: 8),
                            child: Divider()))
                  ]))),
          ResultsLoader(
              searchText: searchFieldText,
              categoryIds: _selectedCategories.map((e) => e.id).toList(),
              coordinates: currentCoordinatesInput)
        ],
      ),
      LocationButton(
        setCoordinates: (position) => setState(() => _coordinates =
            CoordinatesInput(lat: position.latitude, lng: position.longitude)),
      )
    ]);
  }

  _onCategoryPress(CategoryAsset asset, bool isSelected) {
    setState(() {
      if (isSelected) {
        _selectedCategories.add(asset);
      } else {
        _selectedCategories.remove(asset);
      }
    });
  }

  _onSearchFieldTextChanged(String text) {
    _debouncer.run(() => setState(() {
          _searchFieldText = text;
        }));
  }

  _clearInput() {
    final textEditingController = _textEditingController;

    if (textEditingController == null) {
      return;
    }

    textEditingController.clear();
    _onSearchFieldTextChanged(textEditingController.value.text);
  }

  _onSearchPressed() {
    final focusNode = _focusNode;

    if (focusNode == null) {
      return;
    }

    if (focusNode.hasPrimaryFocus) {
      focusNode.nextFocus();
    } else {
      focusNode.requestFocus();
    }
  }
}
