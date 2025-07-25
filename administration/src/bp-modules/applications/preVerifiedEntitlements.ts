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

const hasPreVerifiedEntitlement = (
  applicationDetails: JsonField<'Array'>,
  field: PreVerifiedEntitlementType
): boolean => {
  const entitlement = findValue(applicationDetails, field, 'Array')
  return field === preVerifiedEntitlements.Verein360 ? verein360Matcher(entitlement) : entitlement !== undefined
}

export const getPreVerifiedEntitlementType = (
  applicationDetails: JsonField<'Array'>
): PreVerifiedEntitlementType | undefined =>
  Object.values(preVerifiedEntitlements).find(type => hasPreVerifiedEntitlement(applicationDetails, type))
