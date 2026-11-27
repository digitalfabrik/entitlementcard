import { type Locator, type Page } from '@playwright/test'

import { step, testDoc } from '../user-manual'

/** Login page of the administration, the same for all projects */
export class LoginPage {
  private readonly emailInput: Locator
  private readonly passwordInput: Locator
  private readonly submitButton: Locator
  private readonly forgotPasswordLink: Locator
  readonly errorAlert: Locator
  readonly mainNavigation: Locator
  static errorMessage = 'Der Login ist fehlgeschlagen.'

  constructor(public readonly page: Page) {
    this.emailInput = page.getByLabel('Email-Adresse')
    this.passwordInput = page.getByLabel('Passwort *', { exact: true })
    this.submitButton = page.getByRole('button', { name: 'Anmelden' })
    this.forgotPasswordLink = page.getByRole('link', { name: 'Passwort vergessen' })
    this.errorAlert = page.getByRole('alert')
    this.mainNavigation = page.getByRole('banner')
  }

  async goto(): Promise<void> {
    await step('Öffnen Sie die Verwaltung im Browser.', () => this.page.goto('/'), {
      screenshot: false,
    })
  }

  /** Logs in as a precondition of the test, which is not part of the user manual */
  async login(credentials: { email: string; password: string }): Promise<void> {
    await testDoc.setup('Anmelden', () => this.submitCredentials(credentials))
  }

  /** Logs in as a step of the user manual, only used to describe the login itself */
  async loginWithCredentials(credentials: { email: string; password: string }): Promise<void> {
    await step(
      'Geben Sie Ihre **Email-Adresse** und Ihr **Passwort** ein und klicken Sie auf **Anmelden**.',
      () => this.submitCredentials(credentials),
      { focus: this.submitButton },
    )
  }

  private async submitCredentials(credentials: { email: string; password: string }): Promise<void> {
    await this.emailInput.fill(credentials.email)
    await this.passwordInput.fill(credentials.password)
    await this.submitButton.click()
  }

  async clickForgotPassword(): Promise<void> {
    await step('Klicken Sie auf **Passwort vergessen**.', () => this.forgotPasswordLink.click(), {
      focus: this.forgotPasswordLink,
    })
  }
}
