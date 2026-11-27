import { expect, test } from '../shared/fixtures/nuernberg'
import { LoginPage } from '../shared/pages'

test.describe('Login page', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto()
  })

  test('happy path: valid credentials show main navigation', async ({ tenant, loginPage }) => {
    await loginPage.login(tenant.credentials.regionAdmin)

    await expect(loginPage.mainNavigation).toBeVisible()
  })

  test('wrong password: shows error message', async ({ tenant, loginPage }) => {
    await loginPage.login({
      email: tenant.credentials.regionAdmin.email,
      password: 'this-is-definitely-wrong-pw-99',
    })

    await expect(loginPage.errorAlert).toBeVisible()
    await expect(loginPage.errorAlert).toContainText(LoginPage.errorMessage)
  })

  test('wrong email: shows error message', async ({ tenant, loginPage }) => {
    await loginPage.login({
      email: 'nonexistent.user.xyz@example.invalid',
      password: tenant.credentials.regionAdmin.password,
    })

    await expect(loginPage.errorAlert).toBeVisible()
    await expect(loginPage.errorAlert).toContainText(LoginPage.errorMessage)
  })

  test('forgot password link: navigates away from login page', async ({ loginPage, tenant }) => {
    await loginPage.clickForgotPassword()

    await expect(loginPage.page).toHaveURL(tenant.urls.forgotPassword)
  })
})
