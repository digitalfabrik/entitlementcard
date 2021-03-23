# Digitale Ehrenamtskarte

> App für die [bayerische Ehrenamtskarte](https://www.lbe.bayern.de/engagement-anerkennen/ehrenamtskarte/index.php).
>
> App für Android & iOS + Backend + Administrations-Webportal - **100% offener Quellcode**.

[English](../../README.md) | Deutsch

**Technische Dokumentation ist nur auf englisch verfügbar im `/docs` Ordner.**

![Drei Screenshots von der App mit Karte, Suchfunktion und Ausweisfunktion.](../img/phones1.png)

## Inhalte

**Dieses Projekt besteht aus den folgenden Komponenten:**

- Einer mobilen App für Android und iOS im Ordner `frontend`. Zur Umsetzung der App wurde [Flutter](https://flutter.dev/) verwendet.
  Die App bietet folgenden Funktionen:
    - Anzeige von Akzeptanzstellen aus verschiedenen Kategorien mit unterschiedlichen Symbolen auf einer Karte.
    - Anzeige von Details zu einer Akzeptanzstelle mit Beschreibungstext, Adresse, Telefonnummer, E-Mail-Adresse und Webseite.
    - Eine Seite zum Durchsuchen von Akzeptanzstellen mit optionaler Sortierung nach Distanz zum aktuellen Standort.
    - Eine Ausweisfunktion für eine digitale Ehrenamtskarte.
    - Eine zuverlässige Möglichkeit der Verifizierung einer anderen digitalen Ehrenamtskarte.
    - Ein Bewerbungsformular für eine neue Ehrenamtskarte.
- Ein in Kotlin (JVM) implementiertes `backend`, das für die Verwaltung aller anfallenden Daten zuständig ist.
    - Schnittstellen für die App: Abrufen von Akzeptanzstellen, Verifizierung von digitalen Ehrenamtskarten und Entgegennehmen von Bewerbungen.
    - Schnittstelle für das Administrations-Webportal: Eintragen von neuen digitalen Ehrenamtskarten und Abfragen von Bewerbungen.
- Ein Webportal für die Administration digitaler Ehrenamtskarten, umgesetzt mit [React](https://reactjs.org/) im Ordner `administration`.
- Einer Postgres bzw. [PostGIS](https://postgis.net/) Datenbank zum Speichern der Akzeptanzstellen, sowie der digitalen Ehrenamtskarten und Bewerbungen.
- [Martin](https://github.com/urbica/martin), für Abfragen zur Darstellung von Akzeptanzstellen auf der Karte.

## Projektursprung

Dieses Projekt ist durch 6 Studierende des [Software Engineering Master-Studiengangs](https://elite-se.informatik.uni-augsburg.de/) der Universität Augsburg, 
TU München und LMU München entstanden.

Bei der Zusammenarbeit mit dem _Bayerischen Staatsministerium für Familie, Arbeit und Soziales_ wurden wir von
der [Tür an Tür – Digitalfabrik gGmbH](https://tuerantuer.de/digitalfabrik/) unterstützt.

## Lizenz

Der Inhalt dieses Repository ist unter der freien [MIT-Lizenz](../../LICENSE) verfügbar und darf daher flexibel verwendet und modifiziert werden.