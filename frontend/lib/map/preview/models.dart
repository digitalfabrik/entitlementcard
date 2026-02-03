import 'package:ehrenamtskarte/l10n/translations.g.dart';

class Coordinates {
  double lat;
  double lng;

  Coordinates(this.lat, this.lng);
}

class AcceptingStoreModel {
  int id;
  int? physicalStoreId;
  String? name;
  String? description;
  int categoryId;
  Coordinates? coordinates;
  String? location;
  String? website;
  String? telephone;
  String? email;
  String? street;
  String? postalCode;

  AcceptingStoreModel({
    required this.id,
    required this.categoryId,
    this.physicalStoreId,
    this.name,
    this.description,
    this.coordinates,
    this.location,
    this.website,
    this.telephone,
    this.email,
    this.street,
    this.postalCode,
  });

  factory AcceptingStoreModel.fromGraphql(dynamic store) {
    final physicalStore = store.physicalStore;
    final address = physicalStore?.address;
    final contact = store.contact;
    final coordinates = physicalStore?.coordinates;

    return AcceptingStoreModel(
      id: store.id as int,
      physicalStoreId: physicalStore?.id as int?,
      categoryId: store.categoryId as int,
      name: store.name as String?,
      description: _getLocalizedDescription(store.descriptions as List<dynamic>?),
      coordinates: coordinates != null ? Coordinates(coordinates.lat as double, coordinates.lng as double) : null,
      location: address?.location as String?,
      website: contact?.website as String?,
      telephone: contact?.telephone as String?,
      email: contact?.email as String?,
      street: address?.street as String?,
      postalCode: address?.postalCode as String?,
    );
  }

  static String? _getLocalizedDescription(List<dynamic>? descriptions) {
    if (descriptions == null || descriptions.isEmpty) return null;

    final appLocale = LocaleSettings.currentLocale.languageCode.toUpperCase();
    final fallbackLocale = AppLocale.de.languageCode.toUpperCase();

    String? fallback;

    for (final description in descriptions) {
      if (description.locale == appLocale) {
        return description.text as String?;
      }
      if (description.locale == fallbackLocale) {
        fallback ??= description.text as String?;
      }
    }

    return fallback;
  }
}
