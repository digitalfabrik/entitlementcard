import { type Locator, type Page } from '@playwright/test'

import { NuernbergStore } from '../data/nuernberg-stores'
import { nuernberg } from '../tenants'
import { step, testDoc } from '../user-manual'

export class StoresPage {
  readonly successToast: (type: 'hinzu' | 'geändert' | 'gelöscht') => Locator
  private readonly searchInput: Locator
  private readonly emptyListHeading: Locator

  constructor(public readonly page: Page) {
    this.successToast = type => page.getByRole('alert').filter({ hasText: new RegExp(type) })
    this.searchInput = page.getByRole('searchbox')
    this.emptyListHeading = page.getByRole('heading', { name: 'Noch keine Einträge' })
  }

  async search(query: string): Promise<void> {
    const element = this.searchInput
    await step('Suchen Sie die Akzeptanzstelle über das Suchfeld.', () => element.fill(query), {
      focus: element,
    })
  }

  async goto(): Promise<void> {
    await step(
      'Öffnen Sie **Akzeptanzpartner verwalten**.',
      () => this.page.goto(nuernberg.urls.stores),
      { screenshot: false },
    )
  }

  async waitFor(): Promise<void> {
    await this.page.getByRole('button', { name: 'Neu hinzufügen' }).waitFor({ state: 'visible' })
  }

  async openCreateDialog(): Promise<void> {
    const element = this.page.getByRole('button', { name: 'Neu hinzufügen' })
    await step('Klicken Sie auf **Neu hinzufügen**.', () => element.click(), { focus: element })
  }

  async fillForm(store: NuernbergStore): Promise<void> {
    await step(
      'Füllen Sie das Formular aus.',
      async () => {
        await testDoc.note('Alle mit * markierten Felder sind Pflichtfelder.')
        await testDoc.note(
          'Sie müssen eine gültige Adresse angeben. Im Hintergrund ermittelt das System die zugehörigen ' +
            'GPS-Koordinaten. Falls das System die Adresse nicht ermitteln kann, erscheint eine Fehlermeldung. ' +
            'Der Eintrag kann erst nach einer erfolgreichen Adressvalidierung gespeichert werden.',
        )
        await this.fillFormFields(store)
      },
      // The opened form, the filled form is shown in the screenshot of saving
      { screenshot: 'before' },
    )
  }

  private async fillFormFields(store: NuernbergStore): Promise<void> {
    await this.page.getByLabel('Name *').fill(store.name)
    await this.page.getByLabel('Straße *').fill(store.street)
    await this.page.getByLabel('Hausnummer *').fill(store.houseNumber)
    await this.page.getByLabel('PLZ *').fill(store.postalCode)
    await this.page.getByLabel('Stadt *').fill(store.city)
    await this.page.getByLabel('Kategorie auswählen *').click()
    await this.page.getByRole('option', { name: store.category }).click()
    if (store.phone) await this.page.getByLabel('Telefonnummer').fill(store.phone)
    if (store.email) await this.page.getByLabel('E-Mail').fill(store.email)
    if (store.homepage) await this.page.getByLabel('Homepage').fill(store.homepage)
    if (store.descriptionDe) await this.page.getByLabel('Deutsch').fill(store.descriptionDe)
    if (store.descriptionEn) await this.page.getByLabel('Englisch').fill(store.descriptionEn)
  }

  async saveDialog(): Promise<void> {
    const element = this.page.getByRole('button', { name: 'Speichern' })
    await step('Klicken Sie auf **Speichern**.', () => element.click(), { focus: element })
  }

  async openRowMenu(storeName: string): Promise<void> {
    const element = this.storeRow(storeName).getByLabel('Akzeptanzstellen Menü')
    await step(
      'Klicken Sie auf das **Drei-Punkte-Menü** am Anfang der Zeile.',
      () => element.click(),
      { focus: element },
    )
  }

  async clickEditMenuItem(): Promise<void> {
    const element = this.page.getByRole('menuitem', { name: 'Bearbeiten' })
    await step('Klicken Sie im Menü auf **Bearbeiten**.', () => element.click(), { focus: element })
  }

  async clickDeleteMenuItem(): Promise<void> {
    const element = this.page.getByRole('menuitem', { name: 'Löschen' })
    await step(
      'Klicken Sie im Menü auf **Löschen**.',
      async () => {
        await element.click()
        await testDoc.note('Ein Bestätigungsdialog erscheint.')
      },
      { focus: element },
    )
  }

  async confirmDelete(): Promise<void> {
    const element = this.page.getByRole('dialog').getByRole('button', { name: 'Löschen' })
    await step('Klicken Sie im Dialog auf **Löschen**.', () => element.click(), { focus: element })
  }

  async deleteIfExists(storeName: string): Promise<void> {
    // Without any stores, an empty state is shown instead of the list and its search
    await this.searchInput.or(this.emptyListHeading).first().waitFor()
    if (await this.emptyListHeading.isVisible()) {
      return
    }
    await this.search(storeName)

    try {
      await this.storeRow(storeName).waitFor({ state: 'visible', timeout: 1000 })
      await this.openRowMenu(storeName)
      await this.clickDeleteMenuItem()
      await this.confirmDelete()
      await this.storeRow(storeName).waitFor({ state: 'hidden' })
    } catch {
      // row not found
    }
  }

  storeRow(storeName: string): Locator {
    return this.page.getByRole('row').filter({
      has: this.page.getByRole('gridcell', { name: storeName, exact: true }),
    })
  }
}
