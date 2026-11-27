import { expect, test } from '../shared/fixtures/nuernberg'
import { LoginPage } from '../shared/pages'
import { testDoc, userManualTag } from '../shared/user-manual'

test.describe('Anmelden', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto()
  })

  test(
    'Mit Email-Adresse und Passwort anmelden',
    { tag: [userManualTag] },
    async ({ tenant, loginPage }) => {
      testDoc.description(
        'Für die Verwaltung benötigen Sie ein Benutzerkonto. Sind die Zugangsdaten falsch, zeigt das System ' +
          'die Meldung **Der Login ist fehlgeschlagen.** an. Haben Sie Ihr Passwort vergessen, klicken Sie auf ' +
          '**Passwort vergessen**.',
      )

      await loginPage.loginWithCredentials(tenant.credentials.regionAdmin)

      await testDoc.result(
        'Das System meldet Sie an und zeigt die Startseite der Verwaltung an.',
        async () => {
          await expect(loginPage.mainNavigation).toBeVisible()
        },
      )
    },
  )

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
