import 'dart:ui';

import 'package:meta/meta.dart';

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
  final String icon;
  final String? detailIcon;
  final Color? color;

  @override
  bool operator ==(Object other) =>
      identical(this, other) || other is CategoryAsset && runtimeType == other.runtimeType && id == other.id;

  @override
  int get hashCode => id.hashCode;
}

const List<CategoryAsset> categoryAssets = [
  CategoryAsset(
    id: 0,
    name: 'Auto/Zweirad',
    shortName: 'Mobilität',
    icon: 'assets/category_icons/0.svg',
    detailIcon: 'assets/detail_headers/0_auto.svg',
    color: Color(0xffE89600),
  ),
  CategoryAsset(
    id: 1,
    name: 'Multimedia',
    shortName: 'Multimedia',
    icon: 'assets/category_icons/1.svg',
    detailIcon: 'assets/detail_headers/1_multimedia.svg',
    color: Color(0xFFFA0000),
  ),
  CategoryAsset(
    id: 2,
    name: 'Gesundheit/Sport/Wellness',
    shortName: 'Gesundheit',
    icon: 'assets/category_icons/2.svg',
    detailIcon: 'assets/detail_headers/2_sport.svg',
    color: Color(0xFFE500D3),
  ),
  CategoryAsset(
    id: 3,
    name: 'Bildung/Kultur/Unterhaltung',
    shortName: 'Kultur',
    icon: 'assets/category_icons/3.svg',
    detailIcon: 'assets/detail_headers/3_kultur.svg',
    color: Color(0xFF7500EB),
  ),
  CategoryAsset(
    id: 4,
    name: 'Dienstleistungen/Finanzen',
    shortName: 'Dienstleistung',
    icon: 'assets/category_icons/4.svg',
    detailIcon: 'assets/detail_headers/4_finanzen.svg',
    color: Color(0xFF515151),
  ),
  CategoryAsset(
    id: 5,
    name: 'Mode/Beauty',
    shortName: 'Mode',
    icon: 'assets/category_icons/5.svg',
    detailIcon: 'assets/detail_headers/5_mode.svg',
    color: Color(0xFF6EBE00),
  ),
  CategoryAsset(
    id: 6,
    name: 'Wohnen/Haus/Garten',
    shortName: 'Einrichtung',
    icon: 'assets/category_icons/6.svg',
    detailIcon: 'assets/detail_headers/6_haus.svg',
    color: Color(0xFF00D0C7),
  ),
  CategoryAsset(
    id: 7,
    name: 'Freizeit/Reise/Unterkünfte',
    shortName: 'Freizeit',
    icon: 'assets/category_icons/7.svg',
    detailIcon: 'assets/detail_headers/7_freizeit.svg',
    color: Color(0xFF007CE8),
  ),
  CategoryAsset(
    id: 8,
    name: 'Essen/Trinken/Gastronomie',
    shortName: 'Gastronomie',
    icon: 'assets/category_icons/8.svg',
    detailIcon: 'assets/detail_headers/8_essen.svg',
    color: Color(0xFF197489),
  ),
  CategoryAsset(
    id: 9,
    name: 'Anderes',
    shortName: 'Anderes',
    icon: 'assets/category_icons/9.svg',
    detailIcon: null,
    color: Color(0xFFc51162),
  ),
  CategoryAsset(
    id: 10,
    name: 'Mittagstische',
    shortName: 'Mittagstische',
    icon: 'assets/category_icons/10.svg',
    detailIcon: 'assets/detail_headers/10_mittagstische.svg',
    color: Color(0xFF197489),
  ),
  CategoryAsset(
    id: 11,
    name: 'Kleidung/Gebrauchtes',
    shortName: 'Kleidung',
    icon: 'assets/category_icons/11.svg',
    detailIcon: 'assets/detail_headers/11_kleidung.svg',
    color: Color(0xFF6EBE00),
  ),
  CategoryAsset(
    id: 12,
    name: 'Kultur/Museen/Freizeit',
    shortName: 'Kultur',
    icon: 'assets/category_icons/12.svg',
    detailIcon: 'assets/detail_headers/12_kultur.svg',
    color: Color(0xFF7500EB),
  ),
  CategoryAsset(
    id: 13,
    name: 'Bildung',
    shortName: 'Bildung',
    icon: 'assets/category_icons/13.svg',
    detailIcon: null,
    color: Color(0xFFd100cc),
  ),
  CategoryAsset(
    id: 14,
    name: 'Kinos/Theater/Konzerte',
    shortName: 'Schauspiel',
    icon: 'assets/category_icons/14.svg',
    detailIcon: null,
    color: Color(0xFFc51162),
  ),
  CategoryAsset(
    id: 15,
    name: 'Apotheken/Gesundheit',
    shortName: 'Apotheken',
    icon: 'assets/category_icons/15.svg',
    detailIcon: null,
    color: Color(0xFF007be0),
  ),
  CategoryAsset(
    id: 16,
    name: 'Digitale Teilhabe',
    shortName: 'Digitale Teilhabe',
    icon: 'assets/category_icons/16.svg',
    detailIcon: 'assets/detail_headers/16_teilhabe.svg',
    color: Color(0xFFFA0000),
  ),
  CategoryAsset(
    id: 17,
    name: 'Sport/Bewegung/Tanz',
    shortName: 'Sport',
    icon: 'assets/category_icons/17.svg',
    detailIcon: 'assets/detail_headers/17_sport.svg',
    color: Color(0xFF00ccc6),
  ),
  CategoryAsset(
    id: 18,
    name: 'Mobilität',
    shortName: 'Mobilität',
    icon: 'assets/category_icons/18.svg',
    detailIcon: 'assets/detail_headers/18_mobilitaet.svg',
    color: Color(0xffE89600),
  ),
];
