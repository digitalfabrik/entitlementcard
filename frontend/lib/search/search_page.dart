import 'package:ehrenamtskarte/search/results_loader.dart';
import 'package:flutter/material.dart';

import 'filter_bar.dart';

class SearchPage extends StatefulWidget {
  @override
  createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  String _searchFieldText;
  TextEditingController _textEditingController;
  List<int> _selectedCategories;
  FocusNode _focusNode;

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          title: TextField(
            onChanged: (text) {
              setState(() {
                _searchFieldText = text;
              });
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
        FilterBar(onSelectedCategoriesChange: onSelectedCategoriesChange),
        ResultsLoader(
            searchText: _searchFieldText, searchCategories: _selectedCategories)
      ],
    );
  }

  void onSelectedCategoriesChange(List<int> categories) {
    setState(() {
      _selectedCategories = categories;
    });
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
