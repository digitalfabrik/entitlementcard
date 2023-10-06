import { LocalizationType } from "../types"

const localization: LocalizationType = {
    identification: {
        noCardView: {
            applyTitle: "Beantragen",
            applyDescription:
                "Sie haben noch keinen Nürnberg-Pass? Hier können Sie Ihren Nürnberg-Pass beantragen.",
            activateTitle: "Pass aktivieren",
            activateDescription:
                "Sie haben den Nürnberg-Pass bereits beantragt und einen Aktivierungscode erhalten? Scannen Sie den Code hier ein.",
            verifyTitle: "Gültigkeit prüfen",
            verifyDescription:
                "Sie möchten die Gültigkeit eines Nürnberg-Passes prüfen? Scannen Sie den Code hier ein.",
        },
        activationCodeScanner: {
            title: "Pass aktivieren",
        },
        verificationCodeScanner: {
            title: "Pass verifizieren",
            infoDialogTitle: "So prüfen Sie die Gültigkeit eines Nürnberg-Passes",
            positiveVerificationDialogTitle: "Pass ist gültig",
        },
        moreActions: {
            applyForAnotherCardTitle: "Nürnberg-Pass beantragen oder verlängern",
            applyForAnotherCardDescription: "Ihr hinterlegter Pass bleibt erhalten.",
            activateAnotherCardTitle: "Weiteren Nürnberg-Pass hinzufügen",
            activateAnotherCardDescription: "Ihr hinterlegter Pass bleibt erhalten. Sie können diesen manuell entfernen.",
            verifyTitle: "Einen Nürnberg-Pass prüfen",
            verifyDescription: "Prüfen Sie die Gültigkeit eines Nürnberg-Passes.",
            removeCardTitle: "Diesen Nürnberg-Pass löschen",
            removeCardDescription: "Nach der Auswahl wird der hinterlegte Pass vom Gerät gelöscht.",
        },
        removeCardDialog: {
            title: "Diese Karte löschen?",
            description: "Wenn diese Karte gelöscht wird, muss sie vor der Wiederverwendung neu aktiviert werden.",
        }
    },
}

export default localization
