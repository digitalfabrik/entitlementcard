import { GeneralJsonField, JsonField, findValue } from '../../../components/JsonFieldView'
import { getCertificateVerifications } from '../../../util/certificateVerifications'

const preVerifiedEntitlementFields = {
  Juleica: ['blueCardJuleicaEntitlement'],
  Verein360: ['blueCardWorkAtOrganizationsEntitlement'],
  MilitaryReserve: ['blueCardMilitaryReserveEntitlement', 'goldenCardMilitaryReserveEntitlement'],
  VolunteerService: ['volunteerServiceEntitlement'],
  HonoredByMinisterPresident: ['goldenCardHonoredByMinisterPresidentEntitlement'],
} as const

type EntitlementFieldType = keyof typeof preVerifiedEntitlementFields

export type PreVerifiedEntitlementType = EntitlementFieldType | 'ActivityCertificate'

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

const containsOrganizationContact = (field: GeneralJsonField): boolean =>
  field.type === 'Array' &&
  (field.name === 'organizationContact' || field.value.some(containsOrganizationContact))

/** All activities are verified by an uploaded certificate instead of an organization contact. */
const activityCertificateMatcher = (
  applicationDetails: JsonField<'Array'>,
): 'ActivityCertificate' | undefined =>
  getCertificateVerifications(applicationDetails).length > 0 &&
  !containsOrganizationContact(applicationDetails)
    ? 'ActivityCertificate'
    : undefined

export const getPreVerifiedEntitlementType = (
  applicationJsonValue: JsonField<'Array'>,
): PreVerifiedEntitlementType | undefined => {
  const applicationDetails = findValue(applicationJsonValue, 'applicationDetails', 'Array')

  return applicationDetails !== undefined
    ? ((Object.keys(preVerifiedEntitlementFields) as EntitlementFieldType[]).find(type =>
        preVerifiedEntitlementFields[type].some(field => {
          const entitlement = findValue(applicationDetails, field, 'Array')
          return type === 'Verein360' ? verein360Matcher(entitlement) : entitlement !== undefined
        }),
      ) ?? activityCertificateMatcher(applicationDetails))
    : undefined
}
