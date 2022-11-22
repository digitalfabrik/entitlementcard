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
    mapStyleUrl: {
        production: "https://api.entitlementcard.app/project/bayern.ehrenamtskarte.app/map",
        showcase: "https://tiles.entitlementcard.app/project/showcase.entitlementcard.app/map",
        local: "http://localhost:8000/project/bayern.ehrenamtskarte.app/map",
    },
    backendUrl: {
        production: "https://api.entitlementcard.app",
        showcase: "https://api.entitlementcard.app",
        local: "http://localhost:8000",
    },
    featureFlags: {
        verification: false,
    },
    applicationUrl: "https://bayern.ehrenamtskarte.app/apply-for-eak",
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
