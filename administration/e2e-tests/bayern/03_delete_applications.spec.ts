import { expect, test } from '@playwright/test'

test.describe('DeleteApplications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Switch to Ehrenamtskarte' }).click()
    await page
      .getByRole('textbox', { name: 'erika.musterfrau@example.org' })
      .fill('region-admin@bayern.ehrenamtskarte.app')
    await page.getByPlaceholder('Passwort').fill('Administrator!')
    await page.getByRole('button', { name: 'Anmelden' }).click()
  })

  test('should test applications be deleted', async ({ page, browserName }) => {
    test.setTimeout(200_000)
    await expect(page.getByRole('button', { name: 'Eingehende Anträge' }).nth(1)).toBeVisible()
    await page.getByRole('button', { name: 'Eingehende Anträge' }).nth(1).click()
    await expect(page.getByText('Status', { exact: true })).toBeVisible()

    while (true) {
      const items = await page
        .getByRole('listitem')
        .filter({ hasText: 'Antrag vom' })
        .filter({ hasText: `Name: Doe, ${browserName}` })
        .all()

      if (items.length === 0) {
        break
      }

      const item = items[0]

      await item.click()
      await item.getByRole('button', { name: 'Antrag löschen' }).click()
      await page.getByRole('alertdialog').getByRole('button', { name: 'Antrag löschen' }).click()
      await expect(page.getByRole('alertdialog')).toBeHidden()
    }
  })
})
