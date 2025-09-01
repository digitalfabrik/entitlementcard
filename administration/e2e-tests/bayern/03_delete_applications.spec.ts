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
      try {
        await expect(page.getByRole('dialog')).toBeHidden({ timeout: 200 })
      } catch {}

      const items = await page
        .locator('.MuiAccordion-root')
        .filter({ hasText: 'Antrag vom' })
        .filter({ hasText: `${browserName}` })
        .all()
      // console.log(`Found ${items.length} items for ${browserName}`)

      if (items.length === 0) {
        break
      }

      const item = items[0]

      await item.click()

      const confirmButton = item.getByRole('button', { name: 'Antrag bestätigen' }).first()
      if (await confirmButton.isVisible()) {
        await item.getByRole('button', { name: 'Antrag ablehnen' }).click()

        // Wait for the dropdown to appear and become interactive
        const dropdownSelector = page.getByText('Bitte wählen Sie einen')
        await expect(dropdownSelector).toBeVisible({ timeout: 3000 })
        await dropdownSelector.click()

        await page
          .getByRole('option', {
            name: 'Die angegebene Anwartschaftszeit des Engagements ist leider nicht ausreichend, um die blaue Bayerische Ehrenamtskarte zu erhalten. Erforderlich ist ein Engagement von mindestens zwei Jahren.',
            exact: true,
          })
          .click()
        await page.getByRole('button', { name: 'Ablehnung bestätigen' }).click()
        await page.waitForTimeout(200)
      }
      await expect(item.getByRole('button', { name: 'Antrag löschen' })).toBeVisible()
      await item.getByRole('button', { name: 'Antrag löschen' }).click()
      await expect(page.getByRole('dialog')).toBeVisible()
      await page.getByRole('dialog').getByRole('button', { name: 'Antrag löschen' }).click()
      await expect(page.getByRole('dialog')).toBeHidden()
    }
  })
})
