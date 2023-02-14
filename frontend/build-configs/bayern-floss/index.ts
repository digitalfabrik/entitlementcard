import BuildConfigType, {CommonBuildConfigType} from "../types";
import bayern, {bayernCommon} from "../bayern";

let bayernFlossCommon: CommonBuildConfigType = {
    ...bayernCommon,
    appName: "Ehrenamt FLOSS",
};

let bayernFloss: BuildConfigType = {
    common: bayernFlossCommon,
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
    }
}

export default bayernFloss
