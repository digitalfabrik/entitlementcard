import { describe, expect, it } from 'vitest'

import { GeneralJsonField, JsonField } from '../../../components/JsonFieldView'
import { getPreVerifiedEntitlementType } from './preVerifiedEntitlements'

const applicationJson = (entitlements: GeneralJsonField[]): JsonField<'Array'> => ({
  name: 'application',
  type: 'Array',
  value: [{ name: 'applicationDetails', type: 'Array', value: entitlements }],
})

const entitlement = (name: string): GeneralJsonField => ({ name, type: 'Array', value: [] })

const workAtOrganizationsEntitlement = (isAlreadyVerified: boolean): GeneralJsonField => ({
  name: 'blueCardWorkAtOrganizationsEntitlement',
  type: 'Array',
  value: [
    {
      name: 'workAtOrganization',
      type: 'Array',
      value: [{ name: 'isAlreadyVerified', type: 'Boolean', value: isAlreadyVerified }],
    },
  ],
})

describe('getPreVerifiedEntitlementType', () => {
  it.each([
    ['blueCardJuleicaEntitlement', 'Juleica'],
    ['blueCardMilitaryReserveEntitlement', 'MilitaryReserve'],
    ['goldenCardMilitaryReserveEntitlement', 'MilitaryReserve'],
    ['volunteerServiceEntitlement', 'VolunteerService'],
    ['goldenCardHonoredByMinisterPresidentEntitlement', 'HonoredByMinisterPresident'],
  ])('should detect %s as %s', (field, expectedType) => {
    expect(getPreVerifiedEntitlementType(applicationJson([entitlement(field)]))).toBe(expectedType)
  })

  it('should detect already verified work at organizations as Verein360', () => {
    expect(
      getPreVerifiedEntitlementType(applicationJson([workAtOrganizationsEntitlement(true)])),
    ).toBe('Verein360')
  })

  it('should not detect work at organizations that are not already verified', () => {
    expect(
      getPreVerifiedEntitlementType(applicationJson([workAtOrganizationsEntitlement(false)])),
    ).toBeUndefined()
  })

  it('should not detect applications without pre-verified entitlements', () => {
    expect(
      getPreVerifiedEntitlementType(
        applicationJson([entitlement('blueCardWorkAtDepartmentEntitlement')]),
      ),
    ).toBeUndefined()
  })

  it('should not detect applications without application details', () => {
    expect(
      getPreVerifiedEntitlementType({ name: 'application', type: 'Array', value: [] }),
    ).toBeUndefined()
  })

  describe('ActivityCertificate', () => {
    const certificate: GeneralJsonField = {
      name: 'certificate',
      type: 'Attachment',
      value: { fileIndex: 0 },
    }
    const organization = (withContact: boolean): GeneralJsonField => ({
      name: 'organization',
      type: 'Array',
      value: [
        { name: 'name', type: 'String', value: 'Sportverein' },
        ...(withContact
          ? [{ name: 'organizationContact', type: 'Array' as const, value: [] }]
          : []),
      ],
    })
    const workAtOrganization = (withContact: boolean): GeneralJsonField => ({
      name: 'workAtOrganization',
      type: 'Array',
      value: withContact ? [organization(true)] : [organization(false), certificate],
    })
    const workAtOrganizations = (
      name: string,
      ...activities: GeneralJsonField[]
    ): GeneralJsonField => ({ name, type: 'Array', value: activities })
    const workAtDepartment = (name: string): GeneralJsonField => ({
      name,
      type: 'Array',
      value: [organization(false), certificate],
    })

    it.each(['blueCardWorkAtOrganizationsEntitlement', 'goldenCardWorkAtOrganizationsEntitlement'])(
      'should detect %s with only certificates',
      field => {
        expect(
          getPreVerifiedEntitlementType(
            applicationJson([
              workAtOrganizations(field, workAtOrganization(false), workAtOrganization(false)),
            ]),
          ),
        ).toBe('ActivityCertificate')
      },
    )

    it.each(['blueCardWorkAtDepartmentEntitlement', 'goldenCardWorkAtDepartmentEntitlement'])(
      'should detect %s with a certificate',
      field => {
        expect(getPreVerifiedEntitlementType(applicationJson([workAtDepartment(field)]))).toBe(
          'ActivityCertificate',
        )
      },
    )

    it('should not detect activities if one of them is verified by a contact person', () => {
      expect(
        getPreVerifiedEntitlementType(
          applicationJson([
            workAtOrganizations(
              'blueCardWorkAtOrganizationsEntitlement',
              workAtOrganization(false),
              workAtOrganization(true),
            ),
          ]),
        ),
      ).toBeUndefined()
    })
  })
})
