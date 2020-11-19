import 'package:ehrenamtskarte/models/accepting_businesses_model.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class AcceptingBusinessesPage extends StatelessWidget {
  AcceptingBusinessesPage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Selector<AcceptingBusinessesModel, List<String>>(
      selector: (_, model) => model.filteredAcceptingBusinesses,
      builder: (context, businesses, _) {
        return ListView.builder(
          itemCount: businesses.length,
          itemBuilder: (context, index) {
            final business = businesses[index];

            return new GestureDetector(
                onTap: () {
                  Provider.of<AcceptingBusinessesModel>(context, listen: false)
                      .removeTodo(business);
                },
                child: Container(
                  height: 50,
                  color: Colors.amber[600],
                  child: Center(child: Text(business)),
                ));
          },
        );
      },
    );
  }
}
