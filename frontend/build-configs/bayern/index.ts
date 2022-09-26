import BuildConfigType, {CommonBuildConfigType} from "../types";

export const bayernCommon: CommonBuildConfigType = {
    appName: "Ehrenamt",
    appIcon: "",
    projectId: {
        production: "bayern.ehrenamtskarte.app",
        showcase: "showcase.entitlementcard.app",
        local: "bayern.ehrenamtskarte.app"
    },
    categories: [1, 2, 3],
    theme: {
        primaryColor: "#123456",
        secondaryColor: "#123456"
    },
    mapDataHost: {
        production: "https://tiles.entitlementcard.app",
        showcase: "https://tiles.entitlementcard.app",
        local: "http://localhost:5002",
    },
    backendUrl: {
        production: "https://api.entitlementcard.app",
        showcase: "https://api.entitlementcard.app",
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
