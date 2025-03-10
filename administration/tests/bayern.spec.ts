import { expect, test } from '@playwright/test'

test.describe('Bayern testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/')
    await page.getByRole('button', { name: 'Switch to Ehrenamtskarte' }).click({ force: true })
    await page.goto('http://localhost:3000/beantragen')
  })

  test('blue_init_volunteer', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Vorname(n)' }).fill('John')
    await page.getByRole('textbox', { name: 'Nachname' }).fill('Doe')
    await expect(page.getByRole('heading')).toContainText('Bayerische Ehrenamtskarte beantragen')
    await expect(page.locator('form')).toContainText('ADRESSE (ERSTWOHNSITZ)')
    await page.getByRole('textbox', { name: 'Straße' }).fill('street 32')
    await page.getByRole('textbox', { name: 'Hausnummer' }).fill('12')
    await page.getByRole('textbox', { name: 'Adresszusatz' }).fill('Address number 32')
    await page.getByRole('textbox', { name: 'Postleitzahl' }).fill('123456789')
    await page.getByRole('textbox', { name: 'Ort' }).fill('my place')
    await page.getByRole('textbox', { name: 'Land' }).click()
    await expect(page.locator('form')).toContainText('WEITERE ANGABEN')
    await page.getByRole('textbox', { name: 'E-Mail-Adresse' }).click()
    await page.getByRole('textbox', { name: 'E-Mail-Adresse' }).fill('example@gmail.com')
    await page.getByRole('textbox', { name: 'Telefonnummer' }).click()
    await page.getByRole('textbox', { name: 'Telefonnummer' }).fill('02312312')
    await page.getByRole('textbox', { name: 'Geburtsdatum' }).fill('1990-12-02')
    await page.getByRole('combobox', { expanded: false }).click()
    await page.getByRole('option', { name: 'Augsburg (Stadt)' }).click()
    await page.getByRole('button', { name: 'Nächster Schritt' }).click()
    await expect(page.getByText('Die Bayerische Ehrenamtskarte')).toBeVisible()
    await expect(page.locator('form').first()).toContainText(
      'Die Bayerische Ehrenamtskarte gibt es in zwei Varianten: Die blaue Ehrenamtskarte, welche für drei Jahre gültig ist, und die goldene Ehrenamtskarte, welche unbegrenzt gültig ist. Für die blaue Ehrenamtskarte ist beispielsweise berechtigt, wer sich seit mindestens zwei Jahren mindestens fünf Stunden pro Woche ehrenamtlich engagiert. Für die goldene Ehrenamtskarte ist beispielsweise berechtigt, wer sich seit mindestens 25 Jahren mindestens fünf Stunden pro Woche ehrenamtlich engagiert.'
    )
    await expect(page.locator('form')).toContainText('Antrag auf: *')
    await expect(page.getByRole('radio', { name: 'Blaue Ehrenamtskarte' })).toBeVisible()
    await expect(page.getByRole('radio', { name: 'Goldene Ehrenamtskarte' })).toBeVisible()
    await expect(page.getByRole('radiogroup')).toContainText('Blaue Ehrenamtskarte')
    await expect(page.getByRole('radiogroup')).toContainText('Goldene Ehrenamtskarte')
    await expect(page.locator('form')).toContainText(
      'Die Ehrenamtskarte ist als physische Karte und als digitale Version für Ihr Smartphone oder Tablet erhältlich.Hier können Sie auswählen, welche Kartentypen Sie beantragen möchten.'
    )
    await expect(page.locator('form')).toContainText('Ich beantrage eine digitale Ehrenamtskarte')
    await expect(page.locator('form')).toContainText('Ich beantrage eine physische Ehrenamtskarte')
    await page.getByRole('radio', { name: 'Blaue Ehrenamtskarte' }).check()
    await expect(page.locator('form')).toContainText('Art des Antrags: *')
    await expect(page.locator('form')).toContainText('Erstantrag *')
    await expect(page.locator('form')).toContainText('Verlängerungsantrag *')
    await page.getByRole('radio', { name: 'Erstantrag' }).check()
    await page.getByRole('checkbox', { name: 'Ich beantrage eine physische' }).check()
    await expect(page.locator('form')).toContainText(
      'Die Ehrenamtskarte ist als physische Karte und als digitale Version für Ihr Smartphone oder Tablet erhältlich.Hier können Sie auswählen, welche Kartentypen Sie beantragen möchten.'
    )
    await expect(page.locator('form')).toContainText('Ich beantrage eine digitale Ehrenamtskarte')
    await expect(page.locator('form')).toContainText('Ich beantrage eine physische Ehrenamtskarte')
    await expect(page.getByRole('button', { name: 'Nächster Schritt' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Zurück' })).toBeVisible()
    await page.getByRole('button', { name: 'Nächster Schritt' }).click()
    await expect(page.locator('form').first()).toContainText(
      'Ich erfülle folgende Voraussetzung für die Beantragung einer blauen Ehrenamtskarte: *'
    )
    await expect(page.getByRole('radiogroup')).toContainText(
      'Ich engagiere mich ehrenamtlich seit mindestens zwei Jahren freiwillig mindestens fünf Stunden pro Woche oder bei Projektarbeiten mindestens 250 Stunden jährlich.'
    )
    await expect(page.getByRole('radiogroup')).toContainText('Ich bin Inhaber:in einer JuLeiCa (Jugendleiter:in-Card).')
    await expect(page.getByRole('radiogroup')).toContainText(
      'Ich bin aktiv in der Freiwilligen Feuerwehr mit abgeschlossener Truppmannausbildung bzw. abgeschlossenem Basis-Modul der Modularen Truppausbildung (MTA), oder im Katastrophenschutz oder im Rettungsdienst mit abgeschlossener Grundausbildung.'
    )
    await expect(page.getByRole('radiogroup')).toContainText(
      'Ich habe in den vergangenen zwei Kalenderjahren als Reservist regelmäßig aktiven Wehrdienst in der Bundeswehr geleistet, indem ich insgesamt mindestens 40 Tage Reservisten-Dienstleistung erbracht habe oder ständige:r Angehörige:r eines Bezirks- oder Kreisverbindungskommandos war.'
    )
    await expect(page.getByRole('radiogroup')).toContainText(
      'Ich leiste einen Freiwilligendienst ab in einem Freiwilligen Sozialen Jahr (FSJ), einem Freiwilligen Ökologischen Jahr (FÖJ) oder einem Bundesfreiwilligendienst (BFD).'
    )
    await page.getByRole('radio', { name: 'Ich engagiere mich' }).check()
    await expect(page.locator('form')).toContainText('EHRENAMTLICHE TÄTIGKEIT')
    await page.getByRole('textbox', { name: 'Ehrenamtliche Tätigkeit' }).fill('activity 1')
    await page.getByRole('textbox', { name: 'Tätig seit' }).fill('2010-10-10')
    await page.getByRole('spinbutton', { name: 'Arbeitsstunden pro Woche (' }).fill('56')
    await expect(page.locator('form')).toContainText('Angaben zur Organisation')
    await page.getByRole('textbox', { name: 'Name der Organisation bzw.' }).fill('organization')
    await page.getByRole('textbox', { name: 'Straße' }).fill('number 9')
    await page.getByRole('textbox', { name: 'Hausnummer' }).fill('123')
    await page.getByRole('textbox', { name: 'Adresszusatz' }).fill('Address number 1')
    await page.getByRole('textbox', { name: 'Postleitzahl' }).fill('123456')
    await page.getByRole('textbox', { name: 'Ort' }).fill('12')
    // await page.pause()
    await expect(page.getByRole('textbox', { name: 'Land' })).toHaveValue('Deutschland')
    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: 'Sport' }).click()
    await expect(page.locator('form')).toContainText('Kontaktperson der Organisation')
    await expect(page.locator('form')).toContainText(
      'Bitte geben Sie hier die Daten der Person an, die ihr ehrenamtliches Engagement bestätigen kann.'
    )
    await page.getByRole('textbox', { name: 'Vor- und Nachname der' }).fill('John doe 2')
    await page.getByRole('textbox', { name: 'E-Mail-Adresse' }).fill('test@gmail.com')
    await page.getByRole('textbox', { name: 'Telefon' }).fill('123456798')
    await page.getByRole('checkbox', { name: 'Die Kontaktperson hat der' }).check()
    await expect(page.getByText('Die Kontaktperson hat der')).toBeVisible()
    await expect(page.getByText('Für diese ehrenamtliche Tä')).toBeVisible()
    await expect(page.locator('form')).toContainText('Tätigkeitsnachweis')
    await expect(page.locator('form')).toContainText(
      'Tätigkeitsnachweis Die Datei darf maximal 5 MB groß sein und muss im JPG, PNG oder PDF Format sein.'
    )
    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.getByRole('button', { name: 'Datei Anhängen' }).click()
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles({
      name: 'file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('example text', 'utf-8'),
    })
    await expect(page.getByRole('button', { name: 'Weitere Tätigkeit hinzufügen' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Nächster Schritt' })).toBeVisible()
    await page.getByRole('button', { name: 'Nächster Schritt' }).click()
    await expect(page.locator('form').first()).toContainText(
      'Ich erkläre mich damit einverstanden, dass meine Daten zum Zwecke der Antragsverarbeitung gespeichert werden und akzeptiere die Datenschutzerklärung.'
    )
    await expect(page.getByText('Ich stimme zu, dass ich von')).toBeVisible()
    await expect(page.getByText('Ich versichere, dass alle')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Antrag Abschicken' })).toBeVisible()
    await page.getByRole('checkbox', { name: 'Ich erkläre mich damit' }).check()
    await page.getByRole('checkbox', { name: 'Ich versichere, dass alle' }).check()
    await page.getByRole('button', { name: 'Antrag Abschicken' }).click()
    await page.getByRole('heading', { name: 'Erfolgreich gesendet' }).click()
    await expect(page.getByRole('heading')).toContainText('Erfolgreich gesendet')
    await expect(page.getByRole('paragraph')).toContainText(
      'Ihr Antrag für die Ehrenamtskarte wurde erfolgreich übermittelt.Über den Fortschritt Ihres Antrags werden Sie per E-Mail informiert.Sie können das Fenster jetzt schließen.'
    )
    await page.getByText('Ihr Antrag für die').click()
    page.close()
  })
})
