import BuildConfigType, {CommonBuildConfigType} from "../types";

export const nuernbergCommon: CommonBuildConfigType = {
    appName: "Sozialpass",
    appIcon: "",
    projectId: {
        production: "nuernberg.sozialpass.app",
        showcase: "showcase.entitlementcard.app",
        local: "nuernberg.sozialpass.app"
    },
    categories: [],
    theme: {
        primaryColor: "#123456",
        secondaryColor: "#123456"
    },
    mapStyleUrl: {
        production: "https://api.entitlementcard.app/project/nuernberg.sozialpass.app/map",
        showcase: "https://api.entitlementcard.app/project/showcase.entitlementcard.app/map",
        local: "http://localhost:8000/project/nuernberg.sozialpass.app/map",
    },
    backendUrl: {
        production: "https://api.entitlementcard.app",
        showcase: "https://api.entitlementcard.app",
        local: "http://localhost:7000",
    },
    featureFlags: {
        verification: true,
    },
    applicationUrl: "https://meinkonto.nuernberg.de/intelliform/forms/osg/standard/osg/osg-kette-starten/index?lebenslageIdAuswahl=w_500_sha_d_nuernberg-pass",
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
