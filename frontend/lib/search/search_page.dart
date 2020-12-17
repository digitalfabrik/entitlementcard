import 'package:ehrenamtskarte/search/result_list.dart';
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
            decoration: InputDecoration.collapsed(
              hintText: "Tippen und schreiben, um zu suchen …",
            ),
          ),
          pinned: true,
          actions: [
            IconButton(
              icon: const Icon(Icons.search),
              onPressed: () => {},
            )
          ],
        ),
        FilterBar(onSelectedCategoriesChange: onSelectedCategoriesChange),
        ResultList(
          _searchFieldText,
          _selectedCategories,
        )
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
    super.initState();
  }

  @override
  void dispose() {
    _textEditingController.dispose();
    super.dispose();
  }
}
