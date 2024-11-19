import 'package:ehrenamtskarte/configuration/configuration.dart';
import 'package:ehrenamtskarte/favorites/favorites_model.dart';
import 'package:ehrenamtskarte/favorites/favorites_page.dart';
import 'package:ehrenamtskarte/graphql_gen/graphql_queries/stores/accepting_store_by_id.graphql.dart';
import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:ehrenamtskarte/store_widgets/accepting_store_summary.dart';
import 'package:ehrenamtskarte/store_widgets/detail/detail_app_bar.dart';
import 'package:ehrenamtskarte/store_widgets/removed_store_content.dart';
import 'package:ehrenamtskarte/store_widgets/removed_store_summary.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:mocktail/mocktail.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../utils/fakes.dart';
import '../utils/mocks.dart';

void main() {
  group('Favorites page', () {
    setUpAll(() {
      registerFallbackValue(FakeQueryOptions());
      registerFallbackValue(FakeRoute());
      registerFallbackValue(
          Options$Query$AcceptingStoreById(variables: Variables$Query$AcceptingStoreById(project: '', ids: [])));
    });

    final mockClient = MockGraphQLClient();
    final mockObserver = MockNavigatorObserver();

    // Create a wrapper widget for FavoritesPage to provide necessary context
    Widget createTestWidget() {
      return Configuration(
        mapStyleUrl: 'dummy',
        graphqlUrl: 'dummy',
        projectId: 'dummy',
        showDevSettings: false,
        child: ChangeNotifierProvider<FavoritesModel>(
          create: (_) => FavoritesModel()..initialize(),
          child: MaterialApp(
            navigatorObservers: [mockObserver],
            home: TranslationProvider(
              child: GraphQLProvider(
                client: ValueNotifier(mockClient),
                child: const FavoritesPage(),
              ),
            ),
          ),
        ),
      );
    }

    testWidgets('shows store in favorites if the store is available', (WidgetTester tester) async {
      SharedPreferences.setMockInitialValues(<String, List<String>>{
        'favorites': ['{"storeId":1,"storeName":"Test store","categoryId":9}']
      });

      when(() => mockClient.query(any<Options$Query$AcceptingStoreById>())).thenAnswer((invocation) async {
        final options = invocation.positionalArguments.first as Options$Query$AcceptingStoreById;
        return QueryResult(
          data: {
            'stores': [
              {
                'id': 1,
                'coordinates': {'lat': 48.235256, 'lng': 12.678656, '__typename': 'Coordinates'},
                'store': {
                  'id': 1,
                  'name': 'Test store',
                  'description': 'Test description',
                  'contact': {
                    'id': 1,
                    'email': null,
                    'telephone': '08671 95 80 45',
                    'website': null,
                    '__typename': 'Contact'
                  },
                  'category': {'id': 9, 'name': 'Sonstiges', '__typename': 'Category'},
                  '__typename': 'AcceptingStore'
                },
                'address': {
                  'street': 'Bahnhofstraße 1',
                  'postalCode': '84503',
                  'location': 'Altötting',
                  '__typename': 'Address'
                },
                '__typename': 'PhysicalStore'
              }
            ],
            '__typename': 'Query'
          },
          source: QueryResultSource.network,
          options: options,
        );
      });

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text(t.favorites.title), findsOneWidget);

      final acceptingStoreSummary = find.byType(AcceptingStoreSummary);
      expect(acceptingStoreSummary, findsOneWidget);
      expect(find.descendant(of: acceptingStoreSummary, matching: find.text('Test store')), findsOneWidget);
      expect(find.descendant(of: acceptingStoreSummary, matching: find.text('Test description')), findsOneWidget);
    });

    testWidgets('shows a hint to the user if the store is not available anymore and offers the ability to remove it',
        (WidgetTester tester) async {
      SharedPreferences.setMockInitialValues(<String, List<String>>{
        'favorites': ['{"storeId":1,"storeName":"Test store","categoryId":9}']
      });

      when(() => mockClient.query(any<Options$Query$AcceptingStoreById>())).thenAnswer((invocation) async {
        final options = invocation.positionalArguments.first as Options$Query$AcceptingStoreById;
        return QueryResult(
          data: {
            'stores': [null],
            '__typename': 'Query'
          },
          source: QueryResultSource.network,
          options: options,
        );
      });

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text(t.favorites.title), findsOneWidget);

      final removedStoreSummary = find.byType(RemovedStoreSummary);
      expect(removedStoreSummary, findsOneWidget);
      expect(find.descendant(of: removedStoreSummary, matching: find.text('Test store')), findsOneWidget);
      expect(find.descendant(of: removedStoreSummary, matching: find.text(t.store.acceptingStoreNotAvailable)),
          findsOneWidget);

      await tester.tap(find.byType(RemovedStoreSummary));
      await tester.pumpAndSettle();

      final detailAppBar = find.byType(DetailAppBar);
      expect(detailAppBar, findsOneWidget);
      expect(find.descendant(of: detailAppBar, matching: find.text('Test store')), findsOneWidget);
      expect(find.descendant(of: detailAppBar, matching: find.text(t.category.other)), findsOneWidget);

      final removedStoreContent = find.byType(RemovedStoreContent);
      expect(removedStoreContent, findsOneWidget);
      expect(find.descendant(of: removedStoreContent, matching: find.text(t.store.acceptingStoreNotAvailable)),
          findsOneWidget);
      expect(find.descendant(of: removedStoreContent, matching: find.text(t.store.removeDescription)), findsOneWidget);
      expect(find.widgetWithText(OutlinedButton, t.store.removeButtonText), findsOneWidget);

      await tester.tap(find.widgetWithText(OutlinedButton, t.store.removeButtonText));
      await tester.pump();

      final snackBar = find.byType(SnackBar);
      expect(snackBar, findsOneWidget);
      expect(find.descendant(of: snackBar, matching: find.text(t.favorites.favoriteHasBeenRemoved)), findsOneWidget);

      await tester.pumpAndSettle();

      expect(find.text(t.favorites.title), findsOneWidget);
      expect(find.text(t.favorites.noFavoritesFound), findsOneWidget);
    });

    testWidgets('shows a message if the favorites list is empty', (WidgetTester tester) async {
      SharedPreferences.setMockInitialValues({});

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text(t.favorites.title), findsOneWidget);
      expect(find.text(t.favorites.noFavoritesFound), findsOneWidget);
    });

    testWidgets('shows an error message when favorites loading failed', (WidgetTester tester) async {
      SharedPreferences.setMockInitialValues(<String, String>{'favorites': 'incorrect data'});

      await tester.pumpWidget(createTestWidget());
      await tester.pumpAndSettle();

      expect(find.text(t.favorites.title), findsOneWidget);
      expect(find.text(t.favorites.loadingFailed), findsOneWidget);
      expect(find.widgetWithText(OutlinedButton, t.common.tryAgain), findsOneWidget);

      await tester.tap(find.widgetWithText(OutlinedButton, t.common.tryAgain));
      await tester.pumpAndSettle();

      expect(find.text(t.favorites.title), findsOneWidget);
      expect(find.text(t.favorites.loadingFailed), findsOneWidget);
      expect(find.widgetWithText(OutlinedButton, t.common.tryAgain), findsOneWidget);
    });
  });
}
