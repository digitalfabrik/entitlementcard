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
})
