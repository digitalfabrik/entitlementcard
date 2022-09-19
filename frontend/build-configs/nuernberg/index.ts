import BuildConfigType, {CommonBuildConfigType} from "../types";

export const nuernbergCommon: CommonBuildConfigType = {
    appName: "Sozialpass",
    appIcon: "",
    projectId: "nuernberg.entitlementcard.app",
    categories: [],
    theme: {
        primaryColor: "#123456",
        secondaryColor: "#123456"
    },
    mapDataHost: {
        staging: "https://tiles.staging.nuernberg.entitlementcard.app",
        production: "https://tiles.nuernberg.entitlementcard.app",
        local: "http://localhost:5002",
    },
    backendUrl: {
        staging: "https://api.staging.nuernberg.entitlementcard.app",
        production: "https://api.nuernberg.entitlementcard.app",
        local: "http://10.0.2.2:7000",
    },
    featureFlags: {
        verification: true,
    }
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
