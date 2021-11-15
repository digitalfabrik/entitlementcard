import 'package:ehrenamtskarte/widgets/error_message.dart';
import 'package:ehrenamtskarte/widgets/top_loading_spinner.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:collection/collection.dart';

import '../routing.dart';

class CustomLicenseEntry {
  final String packageName;
  final List<Iterable<LicenseParagraph>> licenseParagraphs;

  CustomLicenseEntry(this.packageName, this.licenseParagraphs);
}

class CustomLicensePage extends StatelessWidget {
  const CustomLicensePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<LicenseEntry>>(
        future: LicenseRegistry.licenses.toList(),
        builder:
            (BuildContext context, AsyncSnapshot<List<LicenseEntry>> snapshot) {
          var licenses = snapshot.data;
          var error = snapshot.error;
          if (snapshot.hasError && error != null) {
            return ErrorMessage(error.toString());
          } else if (snapshot.hasData && licenses != null) {
            var licensesPerPackage =
            licenses.fold<List<CustomLicenseEntry>>([], (value, element) {
              for (var packageName in element.packages) {
                value
                    .add(CustomLicenseEntry(packageName, [element.paragraphs]));
              }
              return value;
            });

            var byPackageName = groupBy(licensesPerPackage,
                    (CustomLicenseEntry license) => license.packageName);

            var result = <CustomLicenseEntry>[];
            byPackageName.forEach((String key, List<CustomLicenseEntry> value) {
              List<Iterable<LicenseParagraph>> listOfParagraphLists =
              value.fold([], (value, element) {
                value.addAll(element.licenseParagraphs);
                return value;
              });

              result.add(CustomLicenseEntry(key, listOfParagraphLists));
            });
            
            result.sortBy((element) => element.packageName);

            return CustomScrollView(
              slivers: <Widget>[
                SliverAppBar(
                  backgroundColor: Colors.transparent,
                  elevation: 0.0,
                  foregroundColor: Theme.of(context).colorScheme.onBackground,
                  title: const Text("Lizenzen"),
                ),
                SliverList(
                  delegate: SliverChildBuilderDelegate(
                        (BuildContext context, int index) {
                      var license = result[index];
                      var paragraphs = license.licenseParagraphs;
                      return ListTile(
                        title: Text(license.packageName),
                        subtitle: Text(paragraphs.length.toString() + " Lizenzen"),
                        onTap: () {
                          Navigator.push(
                              context,
                              AppRoute(
                                builder: (context) =>
                                    SingleLicensePage(license),
                              ));
                        },
                      );
                    },
                    childCount: result.length, // 1000 list items
                  ),
                ),
              ],
            );
          } else {
            // loading
            return const TopLoadingSpinner();
          }
        });
  }
}

class SingleLicensePage extends StatelessWidget {
  final CustomLicenseEntry licenseEntry;

  const SingleLicensePage(this.licenseEntry, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: <Widget>[
        SliverAppBar(
          backgroundColor: Colors.transparent,
          elevation: 0.0,
          foregroundColor: Theme.of(context).colorScheme.onBackground,
          title: Text(licenseEntry.packageName),
        ),
        ...licenseEntry.licenseParagraphs.map(
              (Iterable<LicenseParagraph> e) =>
              SliverList(
                delegate: SliverChildBuilderDelegate(
                      (BuildContext context, int index) {
                    var paragraph = e.toList()[index];

                    return Text(
                        "\t" * paragraph.indent * 2 + paragraph.text, style: Theme
                        .of(context)
                        .textTheme
                        .bodyText1);
                  },
                  childCount: e.length, // 1000 list items
                ),
              ),
        )
      ],
    );
  }
}
