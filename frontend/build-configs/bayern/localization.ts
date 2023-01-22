import { LocalizationType } from "../types"

const localization: LocalizationType = {
    identification: {
        noCardView: {
            applyTitle: "Beantragen",
            applyDescription:
                "Sie sind ehrenamtlich engagiert, haben aber noch keine Ehrenamtskarte? Hier können Sie Ihre Ehrenamtskarte beantragen.",
            activateTitle: "Karte aktivieren",
            activateDescription:
                "Sie haben die Ehrenamtskarte bereits beantragt und den Aktivierungscode Ihrer digitalen Ehrenamtskarte erhalten? Scannen Sie den Code hier ein.",
            verifyTitle: "Gültigkeit prüfen",
            verifyDescription:
                "Sie möchten die Gültigkeit einer digitalen Ehrenamtskarte prüfen? Scannen Sie den Code hier ein.",
        },
        activationCodeScanner: {
            title: "Karte aktivieren",
        },
        verificationCodeScanner: {
            title: "Karte verifizieren",
            infoDialogTitle: "So prüfen Sie die Gültigkeit einer Ehrenamtskarte",
            positiveVerificationDialogTitle: "Karte ist gültig",
        },
        moreActions: {
            applyForAnotherCardTitle: "Weitere Ehrenamtskarte beantragen",
            applyForAnotherCardDescription: "Ihre hinterlegte Karte bleibt erhalten.",
            activateAnotherCardTitle: "Anderen Aktivierungscode einscannen",
            activateAnotherCardDescription: "Dadurch wird die hinterlegte Karte vom Gerät gelöscht.",
            verifyTitle: "Eine digitale Ehrenamtskarte prüfen",
            verifyDescription: "Prüfen Sie die Gültigkeit einer digitalen Ehrenamtskarte.",
        },
    },
}

export default localization
