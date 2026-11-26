import { type Locator, type Page } from '@playwright/test'

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
    await this.page.goto('/')
  }

  async login(credentials: { email: string; password: string }): Promise<void> {
    await this.emailInput.fill(credentials.email)
    await this.passwordInput.fill(credentials.password)
    await this.submitButton.click()
  }

  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click()
  }
}
