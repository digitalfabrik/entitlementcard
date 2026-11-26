import { editedName, stores } from '../shared/data/nuernberg-stores'
import { expect, test } from '../shared/fixtures/nuernberg'
import { mockGeocoding } from '../shared/utils'

test.describe('Manage acceptance stores', () => {
  test.beforeEach(async ({ page, tenant, loginPage, storesPage }) => {
    await mockGeocoding(page)
    await storesPage.goto()
    await loginPage.login(tenant.credentials.storeManager)
  })

  // Remove the created stores, so the tests can be run repeatedly against the same data
  test.afterEach(async ({ storesPage }) => {
    await storesPage.goto()
    await storesPage.waitFor()
    for (const name of [stores.create.name, stores.edit.name, editedName, stores.delete.name]) {
      await storesPage.deleteIfExists(name)
    }
  })

  test('should create a new store', async ({ storesPage }) => {
    await storesPage.openCreateDialog()
    await storesPage.fillForm(stores.create)
    await storesPage.saveDialog()

    await expect(storesPage.successToast('hinzu')).toBeVisible()
    await storesPage.search(stores.create.name)
    await expect(storesPage.storeRow(stores.create.name)).toBeVisible()
  })

  test('should edit an existing store', async ({ storesPage }) => {
    await storesPage.openCreateDialog()
    await storesPage.fillForm(stores.edit)
    await storesPage.saveDialog()
    await expect(storesPage.successToast('hinzu')).toBeVisible()

    await storesPage.search(stores.edit.name)
    await storesPage.openRowMenu(stores.edit.name)
    await storesPage.clickEditMenuItem()
    await storesPage.fillForm({ ...stores.edit, name: editedName })
    await storesPage.saveDialog()

    await expect(storesPage.successToast('geändert')).toBeVisible()
    await storesPage.search(editedName)
    await expect(storesPage.storeRow(editedName)).toBeVisible()
  })

  test('should delete a store', async ({ storesPage }) => {
    await storesPage.openCreateDialog()
    await storesPage.fillForm(stores.delete)
    await storesPage.saveDialog()
    await expect(storesPage.successToast('hinzu')).toBeVisible()

    await storesPage.search(stores.delete.name)
    await storesPage.openRowMenu(stores.delete.name)
    await storesPage.clickDeleteMenuItem()
    await expect(storesPage.page.getByRole('dialog')).toContainText(stores.delete.name)
    await storesPage.confirmDelete()

    await expect(storesPage.successToast('gelöscht')).toBeVisible()
    await expect(storesPage.storeRow(stores.delete.name)).not.toBeVisible()
  })
})
