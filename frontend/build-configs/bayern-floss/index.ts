import BuildConfigType from "../types";
import bayern, {bayernCommon} from "../bayern";

let bayernFlossCommon = {
    appName: "Ehrenamt FLOSS",
};

let bayernFloss: BuildConfigType = {
    android: {
        ...bayern.android,
        ...bayernFlossCommon,
        applicationId: "app.ehrenamtskarte.bayern.floss",
        featureFlags: {
            ...bayern.android.featureFlags,
            excludeLocationPlayServices: true,
            excludeX86: true
        }
    },
    ios: {
        ...bayern.ios,
        ...bayernFlossCommon,
        bundleIdentifier: "app.ehrenamtskarte.bayern.floss"
    }
}

export default bayernFloss
