import { expect, test } from '@playwright/test'

export const expectVisible = async (item, text) => {
  await expect(await item.getByText(text, { exact: true }).last()).toBeVisible()
}

test.describe('Bayern regional admin', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/')
    await page.getByRole('button', { name: 'Switch to Ehrenamtskarte' }).click()
    await page
      .getByRole('textbox', { name: 'erika.musterfrau@example.org' })
      .fill('region-admin@bayern.ehrenamtskarte.app')
    await page.getByPlaceholder('Passwort').fill('Administrator!')
    await page.getByRole('button', { name: 'Anmelden' }).click()
    await expect(page.getByRole('heading').first()).toContainText('Wählen Sie eine Aktion aus:')
    await expect(page.getByRole('button', { name: 'Eingehende Anträge' }).nth(1)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Karten erstellen' }).nth(1)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Benutzer verwalten' }).nth(1)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Statistiken' }).nth(1)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Region verwalten' }).nth(1)).toBeVisible()
  })

  const organizationInfoTest = async item => {
    await expectVisible(item, 'Name der Organisation bzw. des Vereins: organization 1')
    await expectVisible(item, 'Adresse')
    await expectVisible(item, 'Straße: street number 1')
    await expectVisible(item, 'Hausnummer: 123')
    await expectVisible(item, 'Adresszusatz: Address 123')
    await expectVisible(item, 'Ort: That place')
    await expectVisible(item, 'Postleitzahl: 123123')
    await expectVisible(item, 'Land: Deutschland')
    await expectVisible(item, 'Einsatzgebiet: Sport')
    await expectVisible(item, 'Kontaktperson der Organisation')
    await expectVisible(item, 'Vor- und Nachname der Kontaktperson in der Organisation: person 1')
    await expectVisible(item, 'Telefon: 123456789')

    await expectVisible(item, 'E-Mail-Adresse: test@outlook.com')
    await expectVisible(
      item,
      'Die Kontaktperson hat der Weitergabe ihrer Daten zum Zwecke der Antragsverarbeitung zugestimmt und darf zur Überprüfung kontaktiert werden: Ja'
    )
  }

  const organizationInfoTest2 = async item => {
    await expectVisible(item, 'Arbeit bei Organisation oder Verein')
    await expectVisible(item, 'Angaben zur Organisation')
    await expectVisible(item, 'Name der Organisation bzw. des Vereins: organization')
    await expectVisible(item, 'Adresse')
    await expectVisible(item, 'Straße: number 9')
    await expectVisible(item, 'Hausnummer: 123')
    await expectVisible(item, 'Adresszusatz: Address number 1')
    await expectVisible(item, 'Postleitzahl: 123456')
    await expectVisible(item, 'Ort: 12')
    await expectVisible(item, 'Land: Deutschland')
    await expectVisible(item, 'Einsatzgebiet: Sport')
    await expectVisible(item, 'Kontaktperson der Organisation')
    await expectVisible(item, 'Vor- und Nachname der Kontaktperson in der Organisation: John doe 2')
    await expectVisible(item, 'Telefon: 123456798')
    await expectVisible(item, 'E-Mail-Adresse: test@gmail.com')
    await expectVisible(
      item,
      'Die Kontaktperson hat der Weitergabe ihrer Daten zum Zwecke der Antragsverarbeitung zugestimmt und darf zur Überprüfung kontaktiert werden: Ja'
    )
    await expectVisible(item, 'Tätigkeit: activity 1')
    await expectVisible(item, 'Arbeitsstunden pro Woche (Durchschnitt): 56')
    await expectVisible(item, 'Tätig seit: 10.10.1999')
    await expectVisible(
      item,
      'Für diese ehrenamtliche Tätigkeit wurde eine Aufwandsentschädigung gewährt, die über den jährlichen Freibetrag hinaus geht (840 Euro Ehrenamtspauschale bzw. 3000 Euro Übungsleiterpauschale): Nein'
    )
    await expectVisible(item, 'Tätigkeitsnachweis: Anhang 1(siehe Anhang 1)')
    await expectVisible(
      item,
      'Der Antrag wurde direkt von der Organisation/Verein gestellt (z. B. über Drittanbietersoftware verein360).: Nein'
    )
  }

  test.describe.configure({ mode: 'parallel' })

  test('should assert all test applications', async ({ page, browserName }) => {
    test.setTimeout(200_000)
    const casesToVisit = new Set(['blue1', 'blue2', 'blue3', 'blue4', 'blue5', 'gold1', 'gold2', 'gold3', 'gold4'])
    const visitedCases = new Set()

    await page.getByRole('button', { name: 'Eingehende Anträge' }).nth(1).click()
    await expect(page.getByText('Status', { exact: true })).toBeVisible()
    await expect(page.getByRole('button').filter({ hasText: /^$/ })).toBeVisible()
    await expect(page.locator('#allApplications')).toContainText('Alle Anträge')
    await expect(page.locator('#accepted')).toContainText('Akzeptiert')
    await expect(page.locator('#rejected')).toContainText('Abgelehnt')
    await expect(page.locator('#withdrawed')).toContainText('Zurückgezogen')
    await expect(page.locator('#open')).toContainText('Offen')
    await page.getByRole('button').filter({ hasText: /^$/ }).click()
    await expect(page.locator('body')).toContainText('Welcher Status hat welche Bedeutung?')
    await expect(page.locator('body')).toContainText(
      'Akzeptiert:Der Antrag wurden von allen Organisationen geprüft und genehmigt.Die Karte kann erstellt werden.'
    )
    await expect(page.locator('body')).toContainText(
      'Abgelehnt:Der Antrag wurde von allen Organisationen abgelehnt.Der Antrag kann gelöscht werden.'
    )
    await expect(page.locator('body')).toContainText(
      'Zurückgezogen:Der Antragssteller hat den Antrag zurückgezogen.Der Antrag kann gelöscht werden.'
    )
    await expect(page.locator('body')).toContainText(
      'Offen:Der Antrag wurde noch nicht von allen Organisationen geprüft.Die Karte sollte noch nicht erstellt werden.'
    )
    await expect(
      page.getByText('Welcher Status hat welche Bedeutung?Akzeptiert:Der Antrag wurden von allen')
    ).toBeVisible()
    await page.getByRole('button').filter({ hasText: /^$/ }).click()

    // await page.getByRole('button', { name: 'Akzeptiert' }).click()
    const listItems = await page.getByRole('listitem').filter({ hasText: 'Antrag vom' }).all()
    for (const item of listItems) {
      const data = await item.innerText()
      if (!data.includes(`Name: Doe, ${browserName}`)) {
        continue
      }
      if (visitedCases.size === casesToVisit.size) break

      await item.click()
      // Testing Notes for each could increase about 20% time.
      // await item.getByRole('button', { name: 'Notiz anzeigen' }).last().click()
      // const dialog = await page.getByRole('dialog').first()
      // await dialog.getByRole('textbox', { name: 'Fügen Sie hier eine Notiz' }).fill('test')
      // await expect(dialog.getByLabel('Character Counter')).toBeVisible()
      // await expect(dialog.getByLabel('Character Counter')).toContainText('4/1000')
      // await expect(dialog.getByRole('button', { name: 'Schließen' })).toBeVisible()
      // await expect(dialog.getByRole('button', { name: 'Speichern' })).toBeVisible()
      // await dialog.getByRole('button', { name: 'Speichern' }).last().click()
      // await expect(page.getByText('Notiz erfolgreich geändert.').last()).toBeVisible()

      await item.getByRole('heading', { name: 'Persönliche' }).click()
      await expect(await item.getByText('Vorname').first()).toBeVisible()
      await expect(await item.getByText('Nachname').first()).toBeVisible()

      await expectVisible(item, 'Straße: street 32')
      await expectVisible(item, 'Hausnummer: 12')
      await expectVisible(item, 'Adresszusatz: Address number 32')
      await expectVisible(item, 'Postleitzahl: 123456789')
      await expectVisible(item, 'Ort: my place')
      await expect(await item.getByText('Land: Deutschland').first()).toBeVisible()
      await expectVisible(item, 'Geburtsdatum: 10.10.1999')
      await expectVisible(item, 'Telefonnummer: 02312312')
      await expectVisible(item, 'E-Mail-Adresse: example@gmail.com')

      await item.getByRole('heading', { name: 'Antragsdetails' }).click()
      const element = item.getByText(/Antrag auf: (Goldene|Blaue)/)
      await expect(element).toBeVisible()
      await expect(await item.getByText('Ich beantrage eine digitale Ehrenamtskarte: Ja').first()).toBeVisible()
      await expect(await item.getByText('Ich beantrage eine physische Ehrenamtskarte: Ja').first()).toBeVisible()

      if ((await item.innerText()).includes('Goldene')) {
        const h6Element = await item.locator('xpath=.//div[2]/div/div[1]/div[3]/div/div/div/h6').textContent()
        switch (h6Element) {
          case 'Ich bin Inhaber:in des Ehrenzeichens für Verdienste im Ehrenamt des Bayerischen Ministerpräsidenten.':
            await item.getByRole('heading', { name: h6Element }).click()
            await expectVisible(item, 'Kopie der Urkunde: Anhang 1(siehe Anhang 1)')
            await expectVisible(item, 'Bestätigung(en) durch Organisationen:')
            await expectVisible(item, '(keine)')
            await visitedCases.add('gold1')
            break

          case 'Ich leiste als Reservist:in seit mindestens 25 Jahren regelmäßig aktiven Wehrdienst in der Bundeswehr, indem ich in dieser Zeit entweder insgesamt mindestens 500 Tage Reservisten-Dienstleistung erbracht habe oder in dieser Zeit ständige:r Angehörige:r eines Bezirks- oder Kreisverbindungskommandos war.':
            await item.getByRole('heading', { name: h6Element }).click()
            await expectVisible(item, 'Bestätigung(en) durch Organisationen:')
            await expectVisible(item, '(keine)')
            await visitedCases.add('gold2')
            break

          case 'Ich bin seit mindestens 25 Jahren mindestens 5 Stunden pro Woche oder 250 Stunden pro Jahr bei einem Verein oder einer Organisation ehrenamtlich tätig.':
            await organizationInfoTest2(item)
            await visitedCases.add('gold3')
            break

          case 'Ich bin Feuerwehrdienstleistende:r oder Einsatzkraft im Rettungsdienst oder in Einheiten des Katastrophenschutzes und habe eine Dienstzeitauszeichnung nach dem Feuerwehr- und Hilfsorganisationen-Ehrenzeichengesetz (FwHOEzG) erhalten.':
            await organizationInfoTest(item)
            await visitedCases.add('gold4')
            break

          default:
            throw `Unknown golden card option: ${h6Element}`
            break
        }
      } else {
        // blue

        await expect(await item.getByText('Antrag auf: Blaue Ehrenamtskarte').first()).toBeVisible()
        const typeOfApplication = item.getByText(/Art des Antrags: (Verlängerungsantrag|Erstantrag)/)
        await expect(typeOfApplication).toBeVisible()

        await expectVisible(item, 'Ich beantrage eine digitale Ehrenamtskarte: Ja')
        await expectVisible(item, 'Ich beantrage eine physische Ehrenamtskarte: Ja')

        const h6Element = await item.locator('xpath=.//div[2]/div/div[1]/div[3]/div/div/div/h6').textContent()
        switch (h6Element) {
          case 'Ich leiste einen Freiwilligendienst ab in einem Freiwilligen Sozialen Jahr (FSJ), einem Freiwilligen Ökologischen Jahr (FÖJ) oder einem Bundesfreiwilligendienst (BFD).':
            await expectVisible(item, 'Name des Programms: the program')
            await expectVisible(item, 'Tätigkeitsnachweis: Anhang 1(siehe Anhang 1)')
            await expectVisible(item, '(keine)')
            await visitedCases.add('blue1')
            break

          case 'Ich habe in den vergangenen zwei Kalenderjahren als Reservist regelmäßig aktiven Wehrdienst in der Bundeswehr geleistet, indem ich insgesamt mindestens 40 Tage Reservisten-Dienstleistung erbracht habe oder ständige:r Angehörige:r eines Bezirks- oder Kreisverbindungskommandos war.':
            await expectVisible(item, 'Tätigkeitsnachweis: Anhang 1(siehe Anhang 1)')
            await expectVisible(item, 'Bestätigung(en) durch Organisationen:')
            await expectVisible(item, '(keine)')
            await visitedCases.add('blue2')
            break

          case 'Ich bin Inhaber:in einer JuLeiCa (Jugendleiter:in-Card).':
            const imageLocator = item.locator('img[src*="juleica"]')
            await expect(imageLocator).toBeVisible()

            await expectVisible(item, 'Kartennummer: 123456789')
            await expectVisible(item, 'Karte gültig bis: 10.10.1999')
            await expectVisible(item, 'Kopie der Karte (1): Anhang 1(siehe Anhang 1)')
            await expectVisible(item, 'Bestätigung(en) durch Organisationen:')
            await expectVisible(item, '(keine)')
            await visitedCases.add('blue3')
            break

          case 'Ich bin aktiv in der Freiwilligen Feuerwehr mit abgeschlossener Truppmannausbildung bzw. abgeschlossenem Basis-Modul der Modularen Truppausbildung (MTA), oder im Katastrophenschutz oder im Rettungsdienst mit abgeschlossener Grundausbildung.':
            await organizationInfoTest(item)
            await visitedCases.add('blue4')
            break

          case 'Ich engagiere mich ehrenamtlich seit mindestens zwei Jahren freiwillig mindestens fünf Stunden pro Woche oder bei Projektarbeiten mindestens 250 Stunden jährlich.':
            await organizationInfoTest2(item)
            await visitedCases.add('blue5')
            break

          default:
            throw `Unknown blue card option: ${h6Element}`
            break
        }
      }
      await expectVisible(
        item,
        'Ich erkläre mich damit einverstanden, dass meine Daten zum Zwecke der Antragsverarbeitung gespeichert werden und akzeptiere die Datenschutzerklärung: Ja'
      )
      await expectVisible(
        item,
        'Ich stimme zu, dass ich von der lokalen Ehrenamtskoordination über Verlosungen und regionale Angebote informiert werden darf: Nein'
      )
      await expectVisible(item, 'Ich versichere, dass alle angegebenen Informationen korrekt und vollständig sind: Ja')
    }
  })
})
