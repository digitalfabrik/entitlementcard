import { CardBlueprint } from '../../cards/CardBlueprint'
import { ActivityLog } from './ActivityLog'

export const createActivityLogNuernberg = (cardBlueprint: CardBlueprint) => {
  const birthdayExtension = cardBlueprint.extensionHolders.find(extension => extension.state.hasOwnProperty('birthday'))
  const passNumberExtension = cardBlueprint.extensionHolders.find(extension =>
    extension.state.hasOwnProperty('passNumber')
  )
  if (birthdayExtension && passNumberExtension) {
    new ActivityLog(
      cardBlueprint.fullName,
      birthdayExtension.state.birthday,
      passNumberExtension.state.passNumber,
      cardBlueprint.expirationDate!
    ).saveToSessionStorage()
  } else {
    console.error('Mandatory fields are missing for activity log creation')
  }
}
