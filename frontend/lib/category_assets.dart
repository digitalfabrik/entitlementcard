import 'package:ehrenamtskarte/l10n/translations.g.dart';
import 'package:flutter/material.dart';

const test = Color(0xff5f5384);

@immutable
class CategoryAsset {
  const CategoryAsset({
    required this.id,
    required this.name,
    required this.shortName,
    required this.icon,
    required this.detailIcon,
    required this.color,
  });

  final int id;
  final String name;
  final String shortName;
  final IconData icon;
  final String? detailIcon;
  final Color? color;

  @override
  bool operator ==(Object other) =>
      identical(this, other) || other is CategoryAsset && runtimeType == other.runtimeType && id == other.id;

  @override
  int get hashCode => id.hashCode;
}

List<CategoryAsset> categoryAssets(BuildContext context) {
  return [
    CategoryAsset(
      id: 0,
      name: t.category.mobilityLong,
      shortName: t.category.mobility,
      icon: Icons.directions_car,
      detailIcon: 'assets/detail_headers/0_auto.svg',
      color: Color(0xffE89600),
    ),
    CategoryAsset(
      id: 1,
      name: t.category.media,
      shortName: t.category.media,
      icon: Icons.devices,
      detailIcon: 'assets/detail_headers/1_multimedia.svg',
      color: Color(0xFFFA0000),
    ),
    CategoryAsset(
      id: 2,
      name: t.category.healthLong,
      shortName: t.category.health,
      icon: Icons.medical_services,
      detailIcon: 'assets/detail_headers/2_sport.svg',
      color: Color(0xFFE500D3),
    ),
    CategoryAsset(
      id: 3,
      name: t.category.cultureLong,
      shortName: t.category.culture,
      icon: Icons.theater_comedy,
      detailIcon: 'assets/detail_headers/3_kultur.svg',
      color: Color(0xFF7500EB),
    ),
    CategoryAsset(
      id: 4,
      name: t.category.servicesLong,
      shortName: t.category.services,
      icon: Icons.build,
      detailIcon: 'assets/detail_headers/4_finanzen.svg',
      color: Color(0xFF515151),
    ),
    CategoryAsset(
      id: 5,
      name: t.category.fashionLong,
      shortName: t.category.fashion,
      icon: Icons.checkroom,
      detailIcon: 'assets/detail_headers/5_mode.svg',
      color: Color(0xFF6EBE00),
    ),
    CategoryAsset(
      id: 6,
      name: t.category.livingLong,
      shortName: t.category.living,
      icon: Icons.home,
      detailIcon: 'assets/detail_headers/6_haus.svg',
      color: Color(0xFF00D0C7),
    ),
    CategoryAsset(
      id: 7,
      name: t.category.leisureLong,
      shortName: t.category.leisure,
      icon: Icons.sports_soccer,
      detailIcon: 'assets/detail_headers/7_freizeit.svg',
      color: Color(0xFF007CE8),
    ),
    CategoryAsset(
      id: 8,
      name: t.category.foodLong,
      shortName: t.category.food,
      icon: Icons.restaurant,
      detailIcon: 'assets/detail_headers/8_essen.svg',
      color: Color(0xFF197489),
    ),
    CategoryAsset(
      id: 9,
      name: t.category.other,
      shortName: t.category.other,
      icon: Icons.info,
      detailIcon: null,
      color: Color(0xFFc51162),
    ),
    CategoryAsset(
      id: 10,
      name: t.category.lunchTables,
      shortName: t.category.lunchTables,
      icon: Icons.soup_kitchen,
      detailIcon: 'assets/detail_headers/10_mittagstische.svg',
      color: Color(0xFF197489),
    ),
    CategoryAsset(
      id: 11,
      name: t.category.clothingLong,
      shortName: t.category.clothing,
      icon: Icons.checkroom,
      detailIcon: 'assets/detail_headers/11_kleidung.svg',
      color: Color(0xFF6EBE00),
    ),
    CategoryAsset(
      id: 12,
      name: t.category.cultureLongNuernberg,
      shortName: t.category.culture,
      icon: Icons.theater_comedy,
      detailIcon: 'assets/detail_headers/12_kultur.svg',
      color: Color(0xFF7500EB),
    ),
    CategoryAsset(
      id: 13,
      name: t.category.education,
      shortName: t.category.education,
      icon: Icons.school,
      detailIcon: 'assets/detail_headers/13_bildung.svg',
      color: Color(0xFFd100cc),
    ),
    CategoryAsset(
      id: 14,
      name: t.category.moviesLong,
      shortName: t.category.movies,
      icon: Icons.movie,
      detailIcon: 'assets/detail_headers/14_film.svg',
      color: Color(0xFFc51162),
    ),
    CategoryAsset(
      id: 15,
      name: t.category.pharmaciesLong,
      shortName: t.category.pharmacies,
      icon: Icons.local_pharmacy,
      detailIcon: 'assets/detail_headers/15_apotheke.svg',
      color: Color(0xFF007be0),
    ),
    CategoryAsset(
      id: 16,
      name: t.category.digitalParticipation,
      shortName: t.category.digitalParticipation,
      icon: Icons.computer,
      detailIcon: 'assets/detail_headers/16_teilhabe.svg',
      color: Color(0xFFFA0000),
    ),
    CategoryAsset(
      id: 17,
      name: t.category.sportsLong,
      shortName: t.category.sports,
      icon: Icons.sports_soccer,
      detailIcon: 'assets/detail_headers/17_sport.svg',
      color: Color(0xFF00ccc6),
    ),
    CategoryAsset(
      id: 18,
      name: t.category.mobility,
      shortName: t.category.mobility,
      icon: Icons.directions_bus,
      detailIcon: 'assets/detail_headers/18_mobilitaet.svg',
      color: Color(0xffE89600),
    ),
  ];
}
