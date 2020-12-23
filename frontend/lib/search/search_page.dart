import 'package:ehrenamtskarte/category_assets.dart';
import 'package:ehrenamtskarte/search/results_loader.dart';
import 'package:flutter/material.dart';

import '../debouncer.dart';
import 'filter_bar.dart';

class SearchPage extends StatefulWidget {
  @override
  createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  String _searchFieldText;
  TextEditingController _textEditingController;
  List<CategoryAsset> _selectedCategories = new List();
  final _debouncer = Debouncer(delay: Duration(milliseconds: 50));
  FocusNode _focusNode;

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          title: TextField(
            onChanged: (text) {
              _debouncer.run(() => setState(() {
                    _searchFieldText = text;
                  }));
            },
            controller: _textEditingController,
            focusNode: _focusNode,
            decoration: InputDecoration.collapsed(
              hintText: "Tippen und schreiben, um zu suchen …",
            ),
          ),
          pinned: true,
          actions: [
            IconButton(
              icon: const Icon(Icons.search),
              onPressed: () => _focusNode.requestFocus(),
            )
          ],
        ),
        FilterBar(onCategoryPress: (asset, isSelected) {
          setState(() {
            if (isSelected) {
              this._selectedCategories.add(asset);
            } else {
              this._selectedCategories.remove(asset);
            }
          });
        }),
        ResultsLoader(
          searchText: _searchFieldText,
          searchCategories: _selectedCategories,
        )
      ],
    );
  }

  @override
  void initState() {
    _textEditingController = TextEditingController();
    _focusNode = FocusNode();
    super.initState();
  }

  @override
  void dispose() {
    _textEditingController.dispose();
    _focusNode.dispose();
    super.dispose();
  }
}
