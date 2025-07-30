import { type GeneralJsonField, type JsonField, findValue } from './JsonFieldView'

export const preVerifiedEntitlements = {
  Juleica: 'blueCardJuleicaEntitlement',
  Verein360: 'blueCardWorkAtOrganizationsEntitlement',
  HonoredByMinisterPresident: 'goldenCardHonoredByMinisterPresidentEntitlement',
} as const

export type PreVerifiedEntitlementType = (typeof preVerifiedEntitlements)[keyof typeof preVerifiedEntitlements]

const verein360Matcher = (entitlement?: GeneralJsonField): boolean => {
  const entitlements = entitlement !== undefined && Array.isArray(entitlement.value) ? entitlement.value : []
  return entitlements.some(
    (item: GeneralJsonField) =>
      Array.isArray(item.value) &&
      item.value.some((subItem: GeneralJsonField) => subItem.name === 'isAlreadyVerified' && subItem.value === true)
  )
}

export const getPreVerifiedEntitlementType = (
  applicationJsonValue: JsonField<'Array'>
): PreVerifiedEntitlementType | undefined => {
  const applicationDetails = findValue(applicationJsonValue, 'applicationDetails', 'Array')

  return applicationDetails !== undefined
    ? Object.values(preVerifiedEntitlements).find(type => {
        const entitlement = findValue(applicationDetails, type, 'Array')

        return type === preVerifiedEntitlements.Verein360 ? verein360Matcher(entitlement) : entitlement !== undefined
      })
    : undefined
}
