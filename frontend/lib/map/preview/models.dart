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
}
