import { test as base } from '@playwright/test'

import { ImportUsersApi, SelfServicePage } from '../pages'
import { koblenz } from '../tenants'
import { selectProject } from './project'

type KoblenzFixture = {
  tenant: typeof koblenz
  importUsersApi: ImportUsersApi
  selfServicePage: SelfServicePage
}

export const test = base.extend<KoblenzFixture>({
  context: async ({ context }, use) => {
    await selectProject(context, koblenz.projectId)
    await use(context)
  },

  tenant: async ({}, use) => use(koblenz),

  importUsersApi: async ({ request, tenant }, use) =>
    use(new ImportUsersApi(request, tenant.urls.apiUsersImport)),
  selfServicePage: async ({ page }, use) => use(new SelfServicePage(page)),
})

export { expect } from '@playwright/test'
