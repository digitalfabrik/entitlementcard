import 'package:ehrenamtskarte/widgets/error_message.dart';
import 'package:ehrenamtskarte/widgets/navigation_bars.dart';
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
        builder: (BuildContext context, AsyncSnapshot<List<LicenseEntry>> snapshot) {
          var licenses = snapshot.data;
          var error = snapshot.error;
          if (snapshot.hasError && error != null) {
            return ErrorMessage(error.toString());
          } else if (snapshot.hasData && licenses != null) {
            var licensesPerPackage = licenses.fold<List<CustomLicenseEntry>>([], (value, entry) {
              for (var packageName in entry.packages) {
                value.add(CustomLicenseEntry(packageName, [entry.paragraphs]));
              }
              return value;
            });

            var byPackageName = groupBy(licensesPerPackage, (CustomLicenseEntry entry) => entry.packageName);

            var result = <CustomLicenseEntry>[];
            byPackageName.forEach((String key, List<CustomLicenseEntry> value) {
              List<Iterable<LicenseParagraph>> listOfParagraphLists = value.fold([], (value, element) {
                value.addAll(element.licenseParagraphs);
                return value;
              });

              result.add(CustomLicenseEntry(key, listOfParagraphLists));
            });

            result.sortBy((element) => element.packageName);

            return CustomScrollView(
              slivers: <Widget>[
                const SliverNavigationBar(
                  title: "Lizenzen",
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
                                builder: (context) => SingleLicensePage(license),
                              ));
                        },
                      );
                    },
                    childCount: result.length,
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
        SliverNavigationBar(
          title: licenseEntry.packageName,
        ),
        ...licenseEntry.licenseParagraphs.map(
          (Iterable<LicenseParagraph> paragraphs) => SliverList(
            delegate: SliverChildBuilderDelegate(
              (BuildContext context, int index) {
                var paragraph = paragraphs.toList()[index];

                return Text("\t" * paragraph.indent * 2 + paragraph.text, style: Theme.of(context).textTheme.bodyText1);
              },
              childCount: paragraphs.length,
            ),
          ),
        )
      ],
    );
  }
}
