import BuildConfigType, { CommonBuildConfigType } from "../types";

export const nuernbergCommon: CommonBuildConfigType = {
    appName: "Nürnberg-Pass",
    appIcon: "app_icon_nuernberg",
    projectId: {
        production: "nuernberg.sozialpass.app",
        showcase: "showcase.entitlementcard.app",
        local: "nuernberg.sozialpass.app"
    },
    categories: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    theme: {
        primaryLight: "#D88C51",
        primaryDark: "#F9B787"
    },
    mapStyleUrl: {
        production: "https://api.entitlementcard.app/project/nuernberg.sozialpass.app/map",
        showcase: "https://api.entitlementcard.app/project/showcase.entitlementcard.app/map",
        local: "http://localhost:8000/project/nuernberg.sozialpass.app/map",
    },
    mapInitialCoordinatesLat: 49.460983,
    mapInitialCoordinatesLng: 11.061859,
    mapInitialZoomLevel: 10,
    backendUrl: {
        production: "https://api.entitlementcard.app",
        showcase: "https://api.entitlementcard.app",
        local: "http://localhost:8000",
    },
    cardBranding: {
        headerTextColor: "#000000",
        headerTextFontSize: 9,
        headerColor: "#F9B787",
        headerTitleLeft: "Amt für Existenzsicherung und soziale Integration - Sozialamt",
        headerTitleRight: "",
        headerLogo: "assets/nuernberg/header-logo.png",
        headerLogoPadding: 0,
        headerContainerPadding: {top: 0, right: 24, bottom: 0, left: 16},
        bodyContainerPadding: {top: 0, right: 24, bottom: 24, left: 16},
        bodyLogo: "assets/nuernberg/body-logo.png",
        bodyLogoPosition: "right",
        bodyLabel: "Nürnberg-Pass",
        bodyTextColor: "#000000",
        bodyBackgroundImage: true,
        bodyBackgroundImageUrl: "assets/nuernberg/background.png",
        colorStandard: "#F9B787",
        colorPremium: "#F9B787",
        boxDecorationRadius: 0,
    },
    iconInAboutTab: "assets/nuernberg/body-logo.png",
    featureFlags: {},
    applicationUrl: "https://meinkonto.nuernberg.de/intelliform/forms/osg/standard/osg/osg-kette-starten/index?lebenslageIdAuswahl=w_500_sha_d_nuernberg-pass",
    publisherAddress: "Stadt Nürnberg\nAmt für Existenzsicherung\nund soziale Integration\nDietzstraße 4\n90443 Nürnberg",
    dataPrivacyPolicyUrl: "https://nuernberg.sozialpass.app/data-privacy-policy",
    publisherText: `Stadt Nürnberg
Amt für Existenzsicherung und soziale Integration
Dietzstraße 4
90443 Nürnberg

Telefon: REPLACE
Telefax: REPLACE
E-Mail: REPLACE

USt-Identifikations-Nr. gemäß § 27 a Umsatzsteuergesetz: DE - REPLACE

Verantwortlich für den Inhalt

REPLACE
Leiter Referat REPLACE
Telefon: REPLACE
Telefax: REPLACE
E-Mail: REPLACE

E-Mail zum Nürnberg-Pass: REPLACE

Technische Umsetzung:
Tür an Tür - Digitalfabrik gemeinnützige GmbH
https://tuerantuer.de/digitalfabrik/`,
  disclaimerText: `Verantwortlich im Sinne § 7 TMG:
REPLACE
Leiter Referat REPLACE
Telefon: REPLACE
Telefax: REPLACE
E-Mail: REPLACE
Haftung im Sinne §§ 7 - 10 TMG

Die Stadt Nürnberg stellt sein App-Angebot unter folgenden Nutzungsbedingungen zur Verfügung:

• Die App "Nürnberg-Pass" ist nach § 7 Abs. 1 TMG für die eigenen Inhalte, die es zur Nutzung bereithält, nach den allgemeinen Vorschriften verantwortlich. Die Haftung für Schäden materieller oder ideeller Art, die durch die Nutzung der Inhalte verursacht wurden, ist ausgeschlossen, sofern nicht Vorsatz oder grobe Fahrlässigkeit vorliegt.
Bei der Zusammenstellung und Abgabe der Informationen von Vergünstigungen wird alle Sorgfalt walten gelassen. Eine Gewähr für die inhaltliche Vollständigkeit und Richtigkeit der Daten kann dennoch nicht übernommen werden. Insbesondere wird jede Haftung für solche Schäden ausgeschlossen, die bei Anwendern direkt oder indirekt daraus entstehen, dass die Daten genutzt werden.

• Soweit ein Text von dritter Seite erstellt ist, wird die jeweilige Verfasserin oder der jeweilige Verfasser oder die verantwortliche Einrichtung namentlich benannt. In diesen Fällen ist die Verfasserin oder der Verfasser bzw. die genannte Einrichtung des jeweiligen Dokuments für den Inhalt verantwortlich.

• Die App "Nürnberg-Pass" bewertet den Inhalt der verzeichneten Web-Sites zum Zeitpunkt ihrer Aufnahme in das Verzeichnis sorgfältig, und es werden nur solche Verweise aufgenommen, deren Inhalt nach Prüfung zum Zeitpunkt der Aufnahme nicht gegen geltendes Recht verstößt.

• Die App "Nürnberg-Pass" macht sich den Inhalt der zugänglich gemachten fremden Websites jedoch ausdrücklich nicht zu Eigen. Die Inhalte der Sites, auf die verwiesen wird, können sich ständig ändern - das macht gerade das Wesen eines WWW-Angebots aus. Aus diesem Grund übernimmt die App "Nürnberg-Pass" trotz Prüfung keine Gewähr für die Korrektheit, Vollständigkeit und Verfügbarkeit der jeweiligen fremden Website.

• Die App "Nürnberg-Pass" hat keinen Einfluss auf die aktuelle und zukünftige Gestaltung und Inhalte der Seiten.

• Die App "Nürnberg-Pass" übernimmt keine Haftung für Schäden, die aus der Benutzung der Links entstehen könnten.`,
};

let nuernberg: BuildConfigType = {
    common: nuernbergCommon,
    android: {
        ...nuernbergCommon,
        applicationId: "app.entitlementcard.nuernberg",
        featureFlags: {
            ...nuernbergCommon.featureFlags,
            excludeLocationPlayServices: false,
            excludeX86: false
        }
    },
    ios: {
        ...nuernbergCommon,
        bundleIdentifier: "de.nrw.it.ehrensachebayern"
    }
};

export default nuernberg
