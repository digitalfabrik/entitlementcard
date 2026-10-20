import { GeneralJsonField, JsonField, findValue } from '../../../components/JsonFieldView'

const preVerifiedEntitlementFields = {
  Juleica: ['blueCardJuleicaEntitlement'],
  Verein360: ['blueCardWorkAtOrganizationsEntitlement'],
  MilitaryReserve: ['blueCardMilitaryReserveEntitlement', 'goldenCardMilitaryReserveEntitlement'],
  VolunteerService: ['volunteerServiceEntitlement'],
  HonoredByMinisterPresident: ['goldenCardHonoredByMinisterPresidentEntitlement'],
} as const

export type PreVerifiedEntitlementType = keyof typeof preVerifiedEntitlementFields

const verein360Matcher = (entitlement?: GeneralJsonField): boolean => {
  const entitlements =
    entitlement !== undefined && Array.isArray(entitlement.value) ? entitlement.value : []
  return entitlements.some(
    (item: GeneralJsonField) =>
      Array.isArray(item.value) &&
      item.value.some(
        (subItem: GeneralJsonField) =>
          subItem.name === 'isAlreadyVerified' && subItem.value === true,
      ),
  )
}

export const getPreVerifiedEntitlementType = (
  applicationJsonValue: JsonField<'Array'>,
): PreVerifiedEntitlementType | undefined => {
  const applicationDetails = findValue(applicationJsonValue, 'applicationDetails', 'Array')

  return applicationDetails !== undefined
    ? (Object.keys(preVerifiedEntitlementFields) as PreVerifiedEntitlementType[]).find(type =>
        preVerifiedEntitlementFields[type].some(field => {
          const entitlement = findValue(applicationDetails, field, 'Array')
          return type === 'Verein360' ? verein360Matcher(entitlement) : entitlement !== undefined
        }),
      )
    : undefined
}
