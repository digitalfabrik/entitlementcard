import { expect, test } from '../shared/fixtures/koblenz'
import { koblenz } from '../shared/tenants'

test.describe('User entitlement import', () => {
  test('should import users with valid CSV and token', async ({ tenant, importUsersApi }) => {
    const response = await importUsersApi.import(tenant.credentials.apiToken)
    expect(response.ok()).toBeTruthy()
  })

  ;[
    ['missing', undefined],
    ['invalid', 'invalidToken'],
    ['expired', koblenz.credentials.apiTokenExpired],
  ].forEach(([description, token]) => {
    test(`should reject request when token is ${description}`, async ({ importUsersApi }) => {
      const response = await importUsersApi.import(token)
      expect(response.status()).toBe(401)
    })
  })

  ;[
    ['required column is missing', 'regionKey,userHash,startDate,endDate'],
    ['unexpected column is present', 'regionKey,userHash,startDate,endDate,revoked,extraColumn'],
    ['column name is incorrect', 'region,userHash,startDate,endDate,revoked'],
  ].forEach(([description, headers]) => {
    test(`should reject CSV when ${description}`, async ({ tenant, importUsersApi }) => {
      const response = await importUsersApi.importWithHeaders(headers, tenant.credentials.apiToken)
      expect(response.status()).toBe(400)
    })
  })
})
