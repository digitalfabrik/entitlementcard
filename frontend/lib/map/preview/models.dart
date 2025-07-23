class Coordinates {
  double lat;
  double lng;

  Coordinates(this.lat, this.lng);
}

class AcceptingStoreSummaryModel {
  int? physicalStoreId;
  String? name;
  String? description;
  int categoryId;
  Coordinates? coordinates;
  String? location;

  AcceptingStoreSummaryModel(
    this.physicalStoreId,
    this.name,
    this.description,
    this.categoryId,
    this.coordinates,
    this.location,
  );
}
