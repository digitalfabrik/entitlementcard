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
            applyForAnotherCardTitle: "Ehrenamtskarte beantragen oder verlängern",
            applyForAnotherCardDescription: "Ihre hinterlegte Karte bleibt erhalten.",
            activateAnotherCardTitle: "Weitere Ehrenamtskarte hinzufügen",
            activateAnotherCardDescription: "Ihre hinterlegte Ehrenamtskarte bleibt erhalten. Sie können diese manuell entfernen.",
            activationLimitDescription: "Um eine weitere Ehrenamtskarte hinzuzufügen, müssen Sie zuerst eine vorhandene Ehrenamtskarte löschen.",
            verifyTitle: "Eine digitale Ehrenamtskarte prüfen",
            verifyDescription: "Prüfen Sie die Gültigkeit einer digitalen Ehrenamtskarte.",
            removeCardTitle: "Diese Ehrenamtskarte löschen",
            removeCardDescription: "Nach der Auswahl wird diese Ehrenamtskarte vom Gerät gelöscht.",
        },
        removeCardDialog: {
            title: "Diese Karte löschen?",
            description: "Wenn diese Karte gelöscht wird, muss sie vor der Wiederverwendung neu aktiviert werden.",
        }
    },
}

export default localization
