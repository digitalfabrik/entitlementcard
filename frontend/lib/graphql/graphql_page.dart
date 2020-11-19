import 'package:flutter/material.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

String queryString = """
  {
    hello
  }
""";

class GraphQLTestPage extends StatelessWidget {
  GraphQLTestPage({Key key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
        child: Query(
      options: QueryOptions(documentNode: gql(queryString)),
      builder: (QueryResult result,
          {VoidCallback refetch, FetchMore fetchMore}) {
        if (result.hasException) {
          return Text(result.exception.toString(),
              style: TextStyle(color: Colors.red));
        }

        if (result.loading) {
          return Text('Loading …');
        }

        String world = result.data['hello'];
        return Text(world);
      },
    ));
  }
}
