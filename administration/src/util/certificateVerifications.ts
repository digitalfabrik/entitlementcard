import { GeneralJsonField, JsonField, findValue } from '../components/JsonFieldView'

export type CertificateVerification = {
  organizationName: string
  certificate: JsonField<'Attachment'>
}

/**
 * Collects all activities in the application that are verified by an uploaded certificate
 * instead of an organization contact person.
 * Such an activity is an array field containing an `organization` without `organizationContact`
 * and a `certificate` attachment (e.g. `workAtOrganization` or `blueCardWorkAtDepartmentEntitlement`).
 */
export const getCertificateVerifications = (
  jsonField: GeneralJsonField,
): CertificateVerification[] => {
  if (jsonField.type !== 'Array') {
    return []
  }
  const organization = findValue(jsonField, 'organization', 'Array')
  const certificate = findValue(jsonField, 'certificate', 'Attachment')
  if (
    organization !== undefined &&
    certificate !== undefined &&
    findValue(organization, 'organizationContact', 'Array') === undefined
  ) {
    return [
      {
        organizationName: findValue(organization, 'name', 'String')?.value ?? '',
        certificate,
      },
    ]
  }
  return jsonField.value.flatMap(getCertificateVerifications)
}
