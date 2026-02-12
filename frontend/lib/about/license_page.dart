import 'package:collection/collection.dart';
import 'package:ehrenamtskarte/routing.dart';
import 'package:ehrenamtskarte/widgets/app_bars.dart';
import 'package:ehrenamtskarte/widgets/error_message.dart';
import 'package:ehrenamtskarte/widgets/top_loading_spinner.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

import 'package:ehrenamtskarte/l10n/translations.g.dart';

class CustomLicenseEntry {
  final String packageName;
  final List<Iterable<LicenseParagraph>> licenseParagraphs;

  CustomLicenseEntry(this.packageName, this.licenseParagraphs);
}

class CustomLicensePage extends StatefulWidget {
  const CustomLicensePage({super.key});

  @override
  State<CustomLicensePage> createState() => _CustomLicensePageState();
}

class _CustomLicensePageState extends State<CustomLicensePage> {
  late Future<List<LicenseEntry>> licenses;

  @override
  void initState() {
    super.initState();
    licenses = LicenseRegistry.licenses.toList();
  }

  @override
  Widget build(BuildContext context) {
    final t = context.t;
    final theme = Theme.of(context);
    return FutureBuilder<List<LicenseEntry>>(
      future: licenses,
      builder: (BuildContext context, AsyncSnapshot<List<LicenseEntry>> snapshot) {
        final licenses = snapshot.data;
        final error = snapshot.error;
        if (snapshot.hasError && error != null) {
          return ErrorMessage(message: error.toString());
        } else if (snapshot.hasData && licenses != null) {
          final licensesPerPackage = licenses.fold<List<CustomLicenseEntry>>([], (value, entry) {
            for (final packageName in entry.packages) {
              value.add(CustomLicenseEntry(packageName, [entry.paragraphs]));
            }
            return value;
          });

          final byPackageName = groupBy(licensesPerPackage, (CustomLicenseEntry entry) => entry.packageName);

          final result = <CustomLicenseEntry>[];
          byPackageName.forEach((String key, List<CustomLicenseEntry> value) {
            final List<Iterable<LicenseParagraph>> listOfParagraphLists = value.fold([], (value, element) {
              value.addAll(element.licenseParagraphs);
              return value;
            });

            if (key.isNotEmpty) {
              result.add(CustomLicenseEntry(key, listOfParagraphLists));
            }
          });

          result.sortBy((element) => element.packageName.toLowerCase());

          return CustomScrollView(
            slivers: <Widget>[
              CustomSliverAppBar(title: t.about.licenses(n: licenses.length)),
              SliverList(
                delegate: SliverChildBuilderDelegate((BuildContext context, int index) {
                  final license = result[index];
                  final paragraphs = license.licenseParagraphs;
                  return ListTile(
                    title: Text(license.packageName, style: theme.textTheme.titleSmall),
                    subtitle: Text(t.about.numberLicenses(n: paragraphs.length), style: theme.textTheme.bodyMedium),
                    onTap: () {
                      Navigator.push(context, AppRoute(builder: (context) => SingleLicensePage(license)));
                    },
                  );
                }, childCount: result.length),
              ),
            ],
          );
        } else {
          // loading
          return const TopLoadingSpinner();
        }
      },
    );
  }
}

class SingleLicensePage extends StatelessWidget {
  final CustomLicenseEntry licenseEntry;

  const SingleLicensePage(this.licenseEntry, {super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: CustomScrollView(
        slivers: <Widget>[
          CustomSliverAppBar(title: licenseEntry.packageName),
          ...licenseEntry.licenseParagraphs.map(
            (Iterable<LicenseParagraph> paragraphs) => SliverList(
              delegate: SliverChildBuilderDelegate((BuildContext context, int index) {
                final paragraph = paragraphs.toList()[index];

                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  child: Text(
                    '\t' * paragraph.indent * 2 + paragraph.text,
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                );
              }, childCount: paragraphs.length),
            ),
          ),
        ],
      ),
    );
  }
}
