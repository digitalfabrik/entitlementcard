import { editedName, stores } from '../shared/data/nuernberg-stores'
import { expect, test } from '../shared/fixtures/nuernberg'
import { roles, testDoc, userManualTag } from '../shared/user-manual'
import { closeToasts, mockGeocoding } from '../shared/utils'

test.describe(
  'Akzeptanzstellen verwalten',
  testDoc.description(
    'Akzeptanzstellen sind Orte, an denen Berechtigte Vergünstigungen erhalten – zum Beispiel Geschäfte, ' +
      'Einrichtungen oder Dienstleister. In diesem Kapitel erfahren Sie, wie Sie Akzeptanzstellen anlegen, ' +
      'bearbeiten und löschen.',
  ),
  () => {
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

    test('Neue Akzeptanzstelle anlegen', { tag: [userManualTag] }, async ({ storesPage }) => {
      testDoc.role(roles.projectStoreManager)
      testDoc.description(
        'Wenn ein neuer Händler oder eine neue Einrichtung am Programm teilnimmt, müssen Sie diese als ' +
          'Akzeptanzstelle im System anlegen, damit die Berechtigten das Angebot in der App sehen und nutzen können.',
      )

      await storesPage.openCreateDialog()
      await storesPage.fillForm(stores.create)
      await storesPage.saveDialog()

      await testDoc.result(
        'Das System speichert die neue Akzeptanzstelle. Sie erscheint anschließend in der Übersicht.',
        async () => {
          await expect(storesPage.successToast('hinzu')).toBeVisible()
          await storesPage.search(stores.create.name)
          await expect(storesPage.storeRow(stores.create.name)).toBeVisible()
        },
      )
    })

    test('Akzeptanzstelle bearbeiten', { tag: [userManualTag] }, async ({ storesPage }) => {
      testDoc.role(roles.projectStoreManager)
      await testDoc.setup('Akzeptanzstelle für den Test anlegen', async () => {
        await storesPage.openCreateDialog()
        await storesPage.fillForm(stores.edit)
        await storesPage.saveDialog()
        await expect(storesPage.successToast('hinzu')).toBeVisible()
        await closeToasts(storesPage.page)
      })

      await storesPage.search(stores.edit.name)
      await storesPage.openRowMenu(stores.edit.name)
      await storesPage.clickEditMenuItem()
      await storesPage.fillForm({ ...stores.edit, name: editedName })
      await storesPage.saveDialog()

      await testDoc.result(
        'Das System speichert die Änderungen an der Akzeptanzstelle.',
        async () => {
          await expect(storesPage.successToast('geändert')).toBeVisible()
          await storesPage.search(editedName)
          await expect(storesPage.storeRow(editedName)).toBeVisible()
        },
      )
    })

    test('Akzeptanzstelle löschen', { tag: [userManualTag] }, async ({ storesPage }) => {
      testDoc.role(roles.projectStoreManager)
      testDoc.description('**Achtung:** Das Löschen kann nicht rückgängig gemacht werden.')
      await testDoc.setup('Akzeptanzstelle für den Test anlegen', async () => {
        await storesPage.openCreateDialog()
        await storesPage.fillForm(stores.delete)
        await storesPage.saveDialog()
        await expect(storesPage.successToast('hinzu')).toBeVisible()
        await closeToasts(storesPage.page)
      })

      await storesPage.search(stores.delete.name)
      await storesPage.openRowMenu(stores.delete.name)
      await storesPage.clickDeleteMenuItem()
      await expect(storesPage.page.getByRole('dialog')).toContainText(stores.delete.name)
      await storesPage.confirmDelete()

      await testDoc.result('Das System entfernt die Akzeptanzstelle.', async () => {
        await expect(storesPage.successToast('gelöscht')).toBeVisible()
        await expect(storesPage.storeRow(stores.delete.name)).not.toBeVisible()
      })
    })
  },
)
