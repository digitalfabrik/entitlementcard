import 'package:flutter/material.dart';

import '../category_assets.dart';
import '../debouncer.dart';
import '../graphql/graphql_api.graphql.dart';
import '../location/determine_position.dart';
import 'filter_bar.dart';
import 'results_loader.dart';

class SearchPage extends StatefulWidget {
  @override
  State<StatefulWidget> createState() => _SearchPageState();
}

enum LocationRequestStatus { requesting, requestFinished }

class _SearchPageState extends State<SearchPage> {
  String _searchFieldText;
  TextEditingController _textEditingController;
  final List<CategoryAsset> _selectedCategories = [];
  final _debouncer = Debouncer(delay: Duration(milliseconds: 50));
  FocusNode _focusNode;

  CoordinatesInput _coordinates;
  LocationRequestStatus _locationStatus = LocationRequestStatus.requesting;

  @override
  Widget build(BuildContext context) {
    final appBarTextStyle = TextStyle(color: Colors.white);
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          title: TextField(
            onChanged: _onSearchFieldTextChanged,
            controller: _textEditingController,
            focusNode: _focusNode,
            decoration: InputDecoration.collapsed(
              hintText: "Tippen, um zu suchen …",
              hintStyle: appBarTextStyle,
            ),
            cursorColor: Colors.white,
            style: appBarTextStyle,
          ),
          pinned: true,
          actions: [
            IconButton(
              icon: const Icon(Icons.search),
              onPressed: _onSearchPressed,
            )
          ],
        ),
        FilterBar(onCategoryPress: _onCategoryPress),
        SliverToBoxAdapter(
            child: Padding(
                padding: EdgeInsets.all(8),
                child: Row(children: [
                  Text(
                    "Suchresultate".toUpperCase(),
                    style: TextStyle(color: Colors.grey),
                  ),
                  Expanded(
                      child: Padding(
                          padding: EdgeInsets.only(left: 8),
                          child: Divider(thickness: 0.7)))
                ]))),
        if (_locationStatus == LocationRequestStatus.requestFinished)
          ResultsLoader(
              searchText: _searchFieldText,
              categoryIds: _selectedCategories.map((e) => e.id).toList(),
              coordinates: _coordinates)
      ].toList(),
    );
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

  _onSearchPressed() {
    if (_focusNode.hasPrimaryFocus) {
      _focusNode.nextFocus();
    } else {
      _focusNode.requestFocus();
    }
  }

  @override
  void initState() {
    _textEditingController = TextEditingController();
    _focusNode = FocusNode();
    determinePosition()
        .then((value) => setState(() => {
              _coordinates =
                  CoordinatesInput(lat: value.latitude, lng: value.longitude)
            }), onError: (e) => debugPrint(e.toString()))
        .whenComplete(() => setState(() {
              _locationStatus = LocationRequestStatus.requestFinished;
            }));
    super.initState();
  }

  @override
  void dispose() {
    _textEditingController.dispose();
    _focusNode.dispose();
    super.dispose();
  }
}
