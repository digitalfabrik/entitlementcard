import { GeneralJsonField, JsonField, findValue } from '../../../components/JsonFieldView'
import { getCertificateVerifications } from './certificateVerifications'

type ApplicationDetailsMatcher = (applicationDetails: JsonField<'Array'>) => boolean

const hasEntitlement =
  (...entitlementNames: string[]): ApplicationDetailsMatcher =>
  applicationDetails =>
    entitlementNames.some(name => findValue(applicationDetails, name, 'Array') !== undefined)

const isAlreadyVerifiedByVerein360: ApplicationDetailsMatcher = applicationDetails =>
  findValue(applicationDetails, 'blueCardWorkAtOrganizationsEntitlement', 'Array')?.value.some(
    workAtOrganization =>
      workAtOrganization.type === 'Array' &&
      findValue(workAtOrganization, 'isAlreadyVerified', 'Boolean')?.value === true,
  ) ?? false

const containsOrganizationContact = (field: GeneralJsonField): boolean =>
  field.type === 'Array' &&
  (field.name === 'organizationContact' || field.value.some(containsOrganizationContact))

const isVerifiedByCertificate: ApplicationDetailsMatcher = applicationDetails =>
  getCertificateVerifications(applicationDetails).length > 0 &&
  !containsOrganizationContact(applicationDetails)

const preVerifiedEntitlementMatchers = {
  Juleica: hasEntitlement('blueCardJuleicaEntitlement'),
  Verein360: isAlreadyVerifiedByVerein360,
  MilitaryReserve: hasEntitlement(
    'blueCardMilitaryReserveEntitlement',
    'goldenCardMilitaryReserveEntitlement',
  ),
  VolunteerService: hasEntitlement('volunteerServiceEntitlement'),
  HonoredByMinisterPresident: hasEntitlement('goldenCardHonoredByMinisterPresidentEntitlement'),
  ActivityCertificate: isVerifiedByCertificate,
} satisfies Record<string, ApplicationDetailsMatcher>

export type PreVerifiedEntitlementType = keyof typeof preVerifiedEntitlementMatchers

export const getPreVerifiedEntitlementType = (
  applicationJsonValue: JsonField<'Array'>,
): PreVerifiedEntitlementType | undefined => {
  const applicationDetails = findValue(applicationJsonValue, 'applicationDetails', 'Array')
  return applicationDetails !== undefined
    ? (Object.keys(preVerifiedEntitlementMatchers) as PreVerifiedEntitlementType[]).find(type =>
        preVerifiedEntitlementMatchers[type](applicationDetails),
      )
    : undefined
}
