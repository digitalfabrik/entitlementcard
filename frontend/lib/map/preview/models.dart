class Coordinates {
  double lat;
  double lng;
  Coordinates(this.lat, this.lng);
}

class AcceptingStoreSummaryModel {
  int id;
  String? name;
  String? description;
  int categoryId;
  Coordinates? coordinates;
  String? location;

  AcceptingStoreSummaryModel(this.id, this.name, this.description,
      this.categoryId, this.coordinates, this.location);
}
