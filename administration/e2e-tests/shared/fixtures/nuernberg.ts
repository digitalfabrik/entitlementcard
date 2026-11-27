import { type Locator } from '@playwright/test'

import { CardsAddPage, CardsImportPage, LoginPage, StoresPage } from '../pages'
import { nuernberg } from '../tenants'
import { test as base } from '../user-manual'
import { selectProject } from './project'

type NuernbergFixture = {
  tenant: typeof nuernberg
  alert: (text: string | RegExp) => Locator
  row: (name: string) => Locator
  cardsAddPage: CardsAddPage
  cardsImportPage: CardsImportPage
  loginPage: LoginPage
  storesPage: StoresPage
}

export const test = base.extend<NuernbergFixture>({
  context: async ({ context }, use) => {
    await selectProject(context, nuernberg.projectId)
    await use(context)
  },

  tenant: async ({}, use) => use(nuernberg),

  alert: async ({ page }, use) => use(text => page.getByRole('alert').filter({ hasText: text })),

  row: async ({ page }, use) =>
    use(name =>
      page.getByRole('row').filter({ has: page.getByRole('gridcell', { name, exact: true }) }),
    ),

  cardsAddPage: async ({ page }, use) => use(new CardsAddPage(page)),
  cardsImportPage: async ({ page }, use) => use(new CardsImportPage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  storesPage: async ({ page }, use) => use(new StoresPage(page)),
})

export { expect } from '@playwright/test'
