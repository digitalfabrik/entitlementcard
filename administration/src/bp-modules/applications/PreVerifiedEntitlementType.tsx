import { GeneralJsonField, type JsonField, findValue } from './JsonFieldView'

export const preVerifiedEntitlements = {
  Juleica: 'blueCardJuleicaEntitlement',
  Verein360: 'blueCardWorkAtOrganizationsEntitlement',
  HonoredByMinisterPresident: 'goldenCardHonoredByMinisterPresidentEntitlement',
} as const

export type PreVerifiedEntitlementType = (typeof preVerifiedEntitlements)[keyof typeof preVerifiedEntitlements]

type MatcherFn = (entitlement?: GeneralJsonField) => boolean

const defaultMatcher: MatcherFn = entitlement => entitlement !== undefined

const verein360Matcher: MatcherFn = entitlement => {
  const entitlements = Array.isArray(entitlement?.value) ? entitlement.value : []
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
  const matcher = field === preVerifiedEntitlements.Verein360 ? verein360Matcher : defaultMatcher
  return matcher(entitlement)
}

export const getPreVerifiedEntitlementType = (
  applicationDetails: JsonField<'Array'>
): PreVerifiedEntitlementType | undefined =>
  Object.values(preVerifiedEntitlements).find(type => hasPreVerifiedEntitlement(applicationDetails, type))
