import { GeneralJsonField, type JsonField, findValue } from './JsonFieldView'

export const enum PreVerifiedEntitlementType {
  Juleica = 'blueCardJuleicaEntitlement',
  Verein360 = 'blueCardWorkAtOrganizationsEntitlement',
  HonoredByMinisterPresident = 'goldenCardHonoredByMinisterPresidentEntitlement',
}

const hasPreVerifiedEntitlement = (
  applicationDetails: JsonField<'Array'>,
  field: PreVerifiedEntitlementType
): boolean => {
  const entitlement = findValue(applicationDetails, field, 'Array')
  if (field === PreVerifiedEntitlementType.Verein360) {
    const entitlements = entitlement?.value ?? []
    return entitlements.some(
      (item: GeneralJsonField) =>
        Array.isArray(item.value) &&
        item.value.some((subItem: GeneralJsonField) => subItem.name === 'isAlreadyVerified' && subItem.value === true)
    )
  }
  return !!entitlement
}

export const getPreVerifiedEntitlementType = (
  applicationDetails: JsonField<'Array'>
): PreVerifiedEntitlementType | undefined => {
  const entitlementTypes: PreVerifiedEntitlementType[] = [
    PreVerifiedEntitlementType.Juleica,
    PreVerifiedEntitlementType.Verein360,
    PreVerifiedEntitlementType.HonoredByMinisterPresident,
  ]
  return entitlementTypes.find(type => hasPreVerifiedEntitlement(applicationDetails, type))
}
