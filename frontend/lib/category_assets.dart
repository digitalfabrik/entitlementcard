class CategoryAsset {
  const CategoryAsset({this.id, this.name, this.icon, this.detailIcon});

  final int id;
  final String name;
  final String icon;
  final String detailIcon;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CategoryAsset &&
          runtimeType == other.runtimeType &&
          id == other.id;

  @override
  int get hashCode => id.hashCode;
}

const List<CategoryAsset> categoryAssets = [
  const CategoryAsset(
      id: 0,
      name: "Auto/Zweirad",
      icon: "assets/category_icons/0.svg",
      detailIcon: "assets/detail_headers/0_auto.svg"),
  const CategoryAsset(
      id: 1,
      name: 'Multimedia',
      icon: "assets/category_icons/1.svg",
      detailIcon: "assets/detail_headers/1_multimedia.svg"),
  const CategoryAsset(
      id: 2,
      name: 'Gesundheit/Sport/Wellness',
      icon: "assets/category_icons/2.svg",
      detailIcon: "assets/detail_headers/2_sport.svg"),
  const CategoryAsset(
      id: 3,
      name: 'Bildung/Kultur/Unterhaltung',
      icon: "assets/category_icons/3.svg",
      detailIcon: "assets/detail_headers/3_kultur.svg"),
  const CategoryAsset(
      id: 4,
      name: 'Dienstleistungen/Finanzen',
      icon: "assets/category_icons/4.svg",
      detailIcon: "assets/detail_headers/4_finanzen.svg"),
  const CategoryAsset(
      id: 5,
      name: 'Mode/Beauty',
      icon: "assets/category_icons/5.svg",
      detailIcon: "assets/detail_headers/5_mode.svg"),
  const CategoryAsset(
      id: 6,
      name: 'Wohnen/Haus/Garten',
      icon: "assets/category_icons/6.svg",
      detailIcon: "assets/detail_headers/4_haus.svg"),
  const CategoryAsset(
      id: 7,
      name: 'Freizeit/Reise/Unterkünfte',
      icon: "assets/category_icons/7.svg",
      detailIcon: "assets/detail_headers/4_freizeit.svg"),
  const CategoryAsset(
      id: 8,
      name: 'Essen/Trinken/Gastronomie',
      icon: "assets/category_icons/8.svg",
      detailIcon: "assets/detail_headers/4_essen.svg"),
];
