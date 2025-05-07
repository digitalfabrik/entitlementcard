import { JsonField, findValue } from '../bp-modules/applications/JsonFieldView'
import { PreVerifiedQuickIndicatorType } from '../bp-modules/applications/PreVerifiedQuickIndicator'

/* eslint-disable prefer-arrow/prefer-arrow-functions */

export function applicationIsPreVerified(applicationJsonData: JsonField<'Array'>): boolean {
  // TODO Why the `?? applicationJsonData` fallback?
  const applicationDetails = findValue(applicationJsonData, 'applicationDetails', 'Array') ?? applicationJsonData
  const blueCardJuleicaEntitlement = findValue(applicationDetails, 'blueCardJuleicaEntitlement', 'Array')
  const isJuleicaEntitlementType = !!blueCardJuleicaEntitlement
  const workAtOrganizationsEntitlement =
    findValue(applicationDetails, 'blueCardWorkAtOrganizationsEntitlement', 'Array')?.value ?? []
  const isPreVerifiedByOrganization = workAtOrganizationsEntitlement.some(
    entitlement =>
      Array.isArray(entitlement.value) &&
      entitlement.value.some(
        organizationField => organizationField.name === 'isAlreadyVerified' && organizationField.value === true
      )
  )

  return isJuleicaEntitlementType || isPreVerifiedByOrganization
}

export function applicationPreVerificationType(applicationJsonData: JsonField<'Array'>): PreVerifiedQuickIndicatorType {
  // TODO Why the `?? applicationJsonData` fallback?
  const applicationDetails = findValue(applicationJsonData, 'applicationDetails', 'Array') ?? applicationJsonData
  const blueCardJuleicaEntitlement = findValue(applicationDetails, 'blueCardJuleicaEntitlement', 'Array')

  return blueCardJuleicaEntitlement !== undefined
    ? PreVerifiedQuickIndicatorType.Juleica
    : PreVerifiedQuickIndicatorType.Verein360
}
