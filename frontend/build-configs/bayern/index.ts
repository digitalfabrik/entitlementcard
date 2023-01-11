import BuildConfigType, { CommonBuildConfigType } from "../types";

export const bayernCommon: CommonBuildConfigType = {
    appName: "Ehrenamt",
    appIcon: "app_icon_bayern",
    projectId: {
        production: "bayern.ehrenamtskarte.app",
        showcase: "showcase.entitlementcard.app",
        local: "bayern.ehrenamtskarte.app"
    },
    categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    theme: {
        primaryLight: "#5f5384",
        primaryDark: "#8377A9"
    },
    mapStyleUrl: {
        production: "https://api.entitlementcard.app/project/bayern.ehrenamtskarte.app/map",
        showcase: "https://api.entitlementcard.app/project/showcase.entitlementcard.app/map",
        local: "http://localhost:8000/project/bayern.ehrenamtskarte.app/map",
    },
    backendUrl: {
        production: "https://api.entitlementcard.app",
        showcase: "https://api.entitlementcard.app",
        local: "http://localhost:8000",
    },
    cardBranding: {
        headerTextColor: "#008dc9",
        headerColor: "#F5F5FFF5",
        headerTitleLeft: "",
        headerTitleRight: "Freistaat Bayern",
        headerTextFontSize: 8,
        headerLogo: "assets/bayern/header-logo.png",
        headerLogoPadding: 4,
        headerContainerPadding: {top: 0, right: 4, bottom: 0, left: 8},
        bodyContainerPadding: {top: 8, right: 8, bottom: 8, left: 8},
        bodyLogo: "assets/bayern/body-logo.png",
        bodyLogoPosition: "center",
        bodyLabel: "Bayerische Ehrenamtskarte",
        bodyTextColor: "#172c82",
        bodyBackgroundImage: false,
        bodyBackgroundImageUrl: "",
        colorStandard: "#cfeaff",
        colorPremium: "#cab374",
        boxDecorationRadius: 1,
    },
    iconInAboutTab: "assets/bayern/body-logo.png",
    featureFlags: {},
    applicationUrl: "https://bayern.ehrenamtskarte.app/beantragen",
    dataPrivacyPolicyUrl: "https://bayern.ehrenamtskarte.app/data-privacy-policy",
    publisherAddress: "Bayerisches Staatsministerium\nfür Familie, Arbeit und Soziales\nWinzererstraße 9\n80797 München",
    publisherText: `Bayerisches Staatsministerium für Familie, Arbeit und Soziales
Winzererstraße 9
80797 München

Telefon: 089 1261-01
Telefax: 089 1261-1122
E-Mail: Poststelle@stmas.bayern.de

USt-Identifikations-Nr. gemäß § 27 a Umsatzsteuergesetz: DE - 811335517

Verantwortlich für den Inhalt

Christian K. J. Diener
Leiter Referat Öffentlichkeitsarbeit
Telefon: 089 1261-1640
Telefax: 089 1261-181640
E-Mail: Oeffentlichkeitsarbeit@stmas.bayern.de

E-Mail zur Ehrenamtskarte: Ehrenamtskarte@stmas.bayern.de

Technische Umsetzung:
Tür an Tür - Digitalfabrik gemeinnützige GmbH
https://tuerantuer.de/digitalfabrik/`,
    disclaimerText: `Verantwortlich im Sinne § 7 TMG:
Christian K. J. Diener
Leiter Referat Öffentlichkeitsarbeit
Telefon: 089 1261-1640
Telefax: 089 1261-181640
E-Mail: Oeffentlichkeitsarbeit@stmas.bayern.de
Haftung im Sinne §§ 7 - 10 TMG

Das Bayerische Staatsministerium für Arbeit und Soziales, Familie und Integration stellt sein App-Angebot unter folgenden Nutzungsbedingungen zur Verfügung:

• Die App "Ehrenamtskarte" ist nach § 7 Abs. 1 TMG für die eigenen Inhalte, die es zur Nutzung bereithält, nach den allgemeinen Vorschriften verantwortlich. Die Haftung für Schäden materieller oder ideeller Art, die durch die Nutzung der Inhalte verursacht wurden, ist ausgeschlossen, sofern nicht Vorsatz oder grobe Fahrlässigkeit vorliegt.
Bei der Zusammenstellung und Abgabe der Informationen von Vergünstigungen wird alle Sorgfalt walten gelassen. Eine Gewähr für die inhaltliche Vollständigkeit und Richtigkeit der Daten kann dennoch nicht übernommen werden. Insbesondere wird jede Haftung für solche Schäden ausgeschlossen, die bei Anwendern direkt oder indirekt daraus entstehen, dass die Daten genutzt werden.

• Soweit ein Text von dritter Seite erstellt ist, wird die jeweilige Verfasserin oder der jeweilige Verfasser oder die verantwortliche Einrichtung namentlich benannt. In diesen Fällen ist die Verfasserin oder der Verfasser bzw. die genannte Einrichtung des jeweiligen Dokuments für den Inhalt verantwortlich.

• Die App "Ehrenamtskarte" bewertet den Inhalt der verzeichneten Web-Sites zum Zeitpunkt ihrer Aufnahme in das Verzeichnis sorgfältig, und es werden nur solche Verweise aufgenommen, deren Inhalt nach Prüfung zum Zeitpunkt der Aufnahme nicht gegen geltendes Recht verstößt.

• Die App "Ehrenamtskarte" macht sich den Inhalt der zugänglich gemachten fremden Websites jedoch ausdrücklich nicht zu Eigen. Die Inhalte der Sites, auf die verwiesen wird, können sich ständig ändern - das macht gerade das Wesen eines WWW-Angebots aus. Aus diesem Grund übernimmt die App "Ehrenamtskarte" trotz Prüfung keine Gewähr für die Korrektheit, Vollständigkeit und Verfügbarkeit der jeweiligen fremden Website.

• Die App "Ehrenamtskarte" hat keinen Einfluss auf die aktuelle und zukünftige Gestaltung und Inhalte der Seiten.

• Die App "Ehrenamtskarte" übernimmt keine Haftung für Schäden, die aus der Benutzung der Links entstehen könnten.`
}

let bayern: BuildConfigType = {
    common: bayernCommon,
    android: {
        ...bayernCommon,
        applicationId: "de.nrw.it.giz.ehrensache.bayern.android",
        featureFlags: {
            ...bayernCommon.featureFlags,
            excludeLocationPlayServices: false,
            excludeX86: false
        }
    },
    ios: {
        ...bayernCommon,
        bundleIdentifier: "de.nrw.it.ehrensachebayern"
    }
};

export default bayern
