import 'package:meta/meta.dart';

@immutable
class CategoryAsset {
  const CategoryAsset(
      {this.id, this.name, this.shortName, this.icon, this.detailIcon});

  final int id;
  final String name;
  final String shortName;
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
  CategoryAsset(
      id: 0,
      name: "Auto/Zweirad",
      shortName: "Mobilität",
      icon: "assets/category_icons/0.svg",
      detailIcon: "assets/detail_headers/0_auto.svg"),
  CategoryAsset(
      id: 1,
      name: 'Multimedia',
      shortName: "Multimedia",
      icon: "assets/category_icons/1.svg",
      detailIcon: "assets/detail_headers/1_multimedia.svg"),
  CategoryAsset(
      id: 2,
      name: 'Gesundheit/Sport/Wellness',
      shortName: "Gesundheit",
      icon: "assets/category_icons/2.svg",
      detailIcon: "assets/detail_headers/2_sport.svg"),
  CategoryAsset(
      id: 3,
      name: 'Bildung/Kultur/Unterhaltung',
      shortName: "Kultur",
      icon: "assets/category_icons/3.svg",
      detailIcon: "assets/detail_headers/3_kultur.svg"),
  CategoryAsset(
      id: 4,
      name: 'Dienstleistungen/Finanzen',
      shortName: "Dienstleistung",
      icon: "assets/category_icons/4.svg",
      detailIcon: "assets/detail_headers/4_finanzen.svg"),
  CategoryAsset(
      id: 5,
      name: 'Mode/Beauty',
      shortName: "Mode",
      icon: "assets/category_icons/5.svg",
      detailIcon: "assets/detail_headers/5_mode.svg"),
  CategoryAsset(
      id: 6,
      name: 'Wohnen/Haus/Garten',
      shortName: "Einrichtung",
      icon: "assets/category_icons/6.svg",
      detailIcon: "assets/detail_headers/6_haus.svg"),
  CategoryAsset(
      id: 7,
      name: 'Freizeit/Reise/Unterkünfte',
      shortName: "Freizeit",
      icon: "assets/category_icons/7.svg",
      detailIcon: "assets/detail_headers/7_freizeit.svg"),
  CategoryAsset(
      id: 8,
      name: 'Essen/Trinken/Gastronomie',
      shortName: "Gastronomie",
      icon: "assets/category_icons/8.svg",
      detailIcon: "assets/detail_headers/8_essen.svg"),
];
