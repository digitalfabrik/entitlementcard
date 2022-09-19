import BuildConfigType, {CommonBuildConfigType} from "../types";

export const bayernCommon: CommonBuildConfigType = {
    appName: "Ehrenamt",
    appIcon: "",
    projectId: "bayern.ehrenamtskarte.app",
    categories: [1, 2, 3],
    theme: {
        primaryColor: "#123456",
        secondaryColor: "#123456"
    },
    mapDataHost: {
        staging: "https://tiles.staging.bayern.entitlementcard.app",
        production: "https://tiles.bayern.entitlementcard.app",
        local: "http://localhost:5002",
    },
    backendUrl: {
        staging: "https://api.staging.bayern.entitlementcard.app",
        production: "https://api.bayern.entitlementcard.app",
        local: "http://10.0.2.2:7000",
    },
    featureFlags: {
        verification: false,
    }
};

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
