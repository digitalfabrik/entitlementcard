import { type Page, expect } from '@playwright/test'

/**
 * Closes all toasts (see AppSnackbarProvider), e.g. after a precondition of a test,
 * so they do not cover the page in the screenshots of the following steps.
 */
export const closeToasts = async (page: Page): Promise<void> => {
  const closeButtons = page.getByRole('button', { name: 'close snackbar' })
  const toasts = page.getByRole('alert').filter({ has: closeButtons })
  if ((await toasts.count()) > 0) {
    // The close button of a toast closes all toasts
    await closeButtons.first().click()
  }
  await expect(toasts).toHaveCount(0)
}
