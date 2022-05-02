import BuildConfigType from "../types";

export const bayernCommon = {
    appName: "Ehrenamt",
    appIcon: "",
    backendUrl: "",
    featureFlags: {
        developerFriendly: false,
    }
};

let bayern: BuildConfigType = {
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
        bundleIdentifier: "de.nrw.it.giz.ehrensache.bayern.android"
    }
};

export default bayern
