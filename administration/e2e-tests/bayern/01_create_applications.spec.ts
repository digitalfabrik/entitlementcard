import { Page, expect, test } from '@playwright/test'

test.describe('Bayern testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Switch to Ehrenamtskarte' }).click({ force: true })
    await page.goto('/beantragen')
  })

  const testImageFileSelection = async (page: Page, buttonName) => {
    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.getByRole('button', { name: buttonName }).click()
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles({
      name: 'image.png',
      mimeType: 'image/png',
      buffer: Buffer.from(''),
    })
  }

  const fillDateInput = async (page, inputName, dateValue, browserName) => {
    // Firefox can't fill date input in headless mode so it uses the calender as workaround
    if (browserName.toLowerCase() === 'firefox') {
      await page.getByRole('button', { name: 'Datum auswählen' }).click()
      await page.getByRole('radio', { name: '1999' }).click()
      await page.getByRole('radio', { name: 'October' }).click()
      await page.getByRole('gridcell', { name: '10' }).click()
    } else {
      await page.getByRole('textbox', { name: inputName }).fill(dateValue)
    }
  }

  const voluntaryWorkForm = async (page: Page, browser: string) => {
    await expect(page.locator('form')).toContainText('EHRENAMTLICHE TÄTIGKEIT')
    await page.getByRole('textbox', { name: 'Ehrenamtliche Tätigkeit' }).fill('activity 1')
    await fillDateInput(page, 'Tätig seit', '10.10.1999', browser)
    await page.getByRole('spinbutton', { name: 'Arbeitsstunden pro Woche (' }).fill('56')
    await expect(page.getByText('Angaben zur Organisation', { exact: false })).toBeVisible({ timeout: 10_000 })
    await page.getByRole('textbox', { name: 'Name der Organisation bzw.' }).fill('organization')
    await page.getByRole('textbox', { name: 'Straße' }).fill('number 9')
    await page.getByRole('textbox', { name: 'Hausnummer' }).fill('123')
    await page.getByRole('textbox', { name: 'Adresszusatz' }).fill('Address number 1')
    await page.getByRole('textbox', { name: 'Postleitzahl' }).fill('123456')
    await page.getByRole('textbox', { name: 'Ort' }).fill('12')
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

    await expect(page.locator('form').first()).toContainText('Tätigkeitsnachweis')
    await expect(page.locator('form')).toContainText(
      'Falls vorhanden, hängen Sie hier bitte einen eingescannten oder abfotografierten Tätigkeitsnachweis an. Die Datei darf maximal 5 MB groß sein und muss im JPG, PNG oder PDF Format sein.'
    )
    await testImageFileSelection(page, 'Datei Anhängen')
    await expect(page.getByRole('button', { name: 'Weitere Tätigkeit hinzufügen' })).toBeVisible()
  }

  const organizationInfo = async (page: Page) => {
    await expect(page.locator('form').first()).toContainText('ANGABEN ZUR TÄTIGKEIT')
    await expect(page.locator('form')).toContainText('Angaben zur Organisation')
    await page.getByRole('textbox', { name: 'Name der Organisation bzw.' }).fill('organization 1')
    await page.getByRole('textbox', { name: 'Straße' }).fill('street number 1')
    await page.getByRole('textbox', { name: 'Hausnummer' }).fill('123')
    await page.getByRole('textbox', { name: 'Adresszusatz' }).fill('Address 123')
    await page.getByRole('textbox', { name: 'Postleitzahl' }).fill('123123')
    await page.getByRole('textbox', { name: 'Ort' }).fill('That place')
    await expect(page.getByRole('textbox', { name: 'Land' })).toHaveValue('Deutschland')
    await page.getByRole('combobox').click()
    await page.getByRole('option', { name: 'Sport' }).click()
    await page.getByRole('textbox', { name: 'Vor- und Nachname der' }).fill('person 1')
    await page.getByRole('textbox', { name: 'E-Mail-Adresse' }).fill('test@outlook.com')
    await page.getByRole('textbox', { name: 'Telefon' }).fill('123456789')
    await expect(page.locator('form')).toContainText(
      'Die Kontaktperson hat der Weitergabe ihrer Daten zum Zwecke der Antragsverarbeitung zugestimmt und darf zur Überprüfung kontaktiert werden *'
    )
    await page.getByRole('checkbox', { name: 'Die Kontaktperson hat der' }).check()
    await page.getByRole('textbox', { name: 'Funktion oder Tätigkeit' }).fill('activity about activity')
    await expect(page.locator('form')).toContainText('Tätigkeitsnachweis')
    await expect(page.locator('form')).toContainText(
      'Falls vorhanden, hängen Sie hier bitte einen eingescannten oder abfotografierten Tätigkeitsnachweis an. Die Datei darf maximal 5 MB groß sein und muss im JPG, PNG oder PDF Format sein.'
    )
    await testImageFileSelection(page, 'Datei Anhängen')
  }

  const personalInfo = async (page: Page, browserName) => {
    await page.getByRole('textbox', { name: 'Vorname(n)' }).fill(browserName)
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
    await fillDateInput(page, 'Geburtsdatum', '10.10.1999', browserName)
    await page.getByRole('combobox', { expanded: false }).click()
    await page.getByRole('option', { name: 'Augsburg (Stadt)' }).click()
    await page.getByRole('button', { name: 'Nächster Schritt' }).click()
  }

  const cardType = async (page: Page, cardType, applicationType = 'initial') => {
    const form = page.locator('form').last()
    await expect(form).toContainText(
      'Die Bayerische Ehrenamtskarte gibt es in zwei Varianten: Die blaue Ehrenamtskarte, welche für drei Jahre gültig ist, und die goldene Ehrenamtskarte, welche unbegrenzt gültig ist. Für die blaue Ehrenamtskarte ist beispielsweise berechtigt, wer sich seit mindestens zwei Jahren mindestens fünf Stunden pro Woche ehrenamtlich engagiert. Für die goldene Ehrenamtskarte ist beispielsweise berechtigt, wer sich seit mindestens 25 Jahren mindestens fünf Stunden pro Woche ehrenamtlich engagiert.'
    )
    await expect(form).toContainText(
      'Die Erfüllung der Voraussetzungen wird im nächsten Schritt des Antrags abgefragt. Weitere Informationen können Sie hier einsehen.'
    )
    await expect(form).toContainText('Antrag auf: *')
    await expect(page.getByRole('radio', { name: 'Blaue Ehrenamtskarte' })).toBeVisible()
    await expect(page.getByRole('radio', { name: 'Goldene Ehrenamtskarte' })).toBeVisible()
    await expect(page.getByRole('radiogroup')).toContainText('Blaue Ehrenamtskarte')
    await expect(page.getByRole('radiogroup')).toContainText('Goldene Ehrenamtskarte')
    await expect(form).toContainText(
      'Die Ehrenamtskarte ist als physische Karte und als digitale Version für Ihr Smartphone oder Tablet erhältlich.Hier können Sie auswählen, welche Kartentypen Sie beantragen möchten.'
    )
    await page
      .getByRole('radio', { name: cardType == 'blue' ? 'Blaue Ehrenamtskarte' : 'Goldene Ehrenamtskarte' })
      .click()
    if (cardType == 'blue') {
      await expect(form).toContainText('Art des Antrags: *')
      await expect(form).toContainText('Erstantrag *')
      await expect(form).toContainText('Verlängerungsantrag *')
      await page
        .getByRole('radio', { name: applicationType == 'initial' ? 'Erstantrag' : 'Verlängerungsantrag' })
        .click()
    }

    await page.getByRole('checkbox', { name: 'Ich beantrage eine physische' }).check()
    await expect(form).toContainText(
      'Die Ehrenamtskarte ist als physische Karte und als digitale Version für Ihr Smartphone oder Tablet erhältlich.Hier können Sie auswählen, welche Kartentypen Sie beantragen möchten.'
    )
    await expect(form).toContainText('Ich beantrage eine digitale Ehrenamtskarte')
    await expect(form).toContainText('Ich beantrage eine physische Ehrenamtskarte')
    await expect(page.getByRole('button', { name: 'Nächster Schritt' }).last()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Zurück' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Alle Eingaben verwerfen' })).toBeVisible()
    await page.getByRole('button', { name: 'Nächster Schritt' }).last().click()
  }

  const requirements = async (page: Page, cardType, requirement: number, browser: string) => {
    if (cardType == 'blue') {
      await handleBlueCardRequirements(page, requirement, browser)
    } else {
      await handleGoldCardRequirements(page, requirement, browser)
    }
    await expect(page.getByRole('button', { name: 'Nächster Schritt' })).toBeVisible()
    await page.getByRole('button', { name: 'Nächster Schritt' }).click()
  }

  const handleBlueCardRequirements = async (page: Page, requirement: number, browser: string) => {
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

    switch (requirement) {
      case 1:
        await page.getByRole('radio', { name: 'Ich engagiere mich' }).check()
        await voluntaryWorkForm(page, browser)
        break
      case 2:
        await page.getByRole('radio', { name: 'Ich bin Inhaber:in einer' }).check()
        await expect(page.locator('form')).toContainText('ANGABEN ZUR JULEICA')
        await page.getByRole('textbox', { name: 'Kartennummer' }).fill('123456789')
        await fillDateInput(page, 'Karte gültig bis', '10.10.1999', browser)
        await expect(page.locator('h4')).toContainText('Kopie der JuLeiCa')
        await expect(page.getByRole('paragraph')).toContainText(
          'Hängen Sie hier bitte Ihre eingescannte oder abfotografierte JuLeiCa an. Die Datei darf maximal 5 MB groß sein und muss im JPG, PNG oder PDF Format sein.'
        )
        await testImageFileSelection(page, 'Datei Anhängen *')
        break
      case 3:
        await page.getByRole('radio', { name: 'Ich bin aktiv in der' }).check()
        await organizationInfo(page)
        break
      case 4:
        await page.getByRole('radio', { name: 'Ich habe in den vergangenen' }).check()
        await expect(page.locator('form')).toContainText('ANGABEN ZUR TÄTIGKEIT')
        await expect(page.locator('h4')).toContainText('Tätigkeitsnachweis')
        await expect(page.getByRole('paragraph')).toContainText(
          'Falls vorhanden, hängen Sie hier bitte einen eingescannten oder abfotografierten Tätigkeitsnachweis an. Die Datei darf maximal 5 MB groß sein und muss im JPG, PNG oder PDF Format sein.'
        )
        await testImageFileSelection(page, 'Datei Anhängen *')
        break
      case 5:
        await page.getByRole('radio', { name: 'Ich leiste einen' }).check()
        await expect(page.locator('form')).toContainText('ANGABEN ZUR TÄTIGKEIT')
        await page.getByRole('textbox', { name: 'Name des Programms' }).fill('the program')
        await expect(page.locator('form')).toContainText(
          'Falls vorhanden, hängen Sie hier bitte einen eingescannten oder abfotografierten Tätigkeitsnachweis an. Die Datei darf maximal 5 MB groß sein und muss im JPG, PNG oder PDF Format sein.'
        )
        await testImageFileSelection(page, 'Datei Anhängen *')
        break
    }
  }

  const handleGoldCardRequirements = async (page: Page, requirement: number, browser: string) => {
    await expect(page.locator('form').first()).toContainText(
      'Ich erfülle folgende Voraussetzung für die Beantragung einer goldenen Ehrenamtskarte: *'
    )
    await expect(page.getByRole('radiogroup')).toContainText(
      'Ich bin seit mindestens 25 Jahren mindestens 5 Stunden pro Woche oder 250 Stunden pro Jahr bei einem Verein oder einer Organisation ehrenamtlich tätig.'
    )
    await expect(page.getByRole('radiogroup')).toContainText(
      'Ich bin Inhaber:in des Ehrenzeichens für Verdienste im Ehrenamt des Bayerischen Ministerpräsidenten.'
    )
    await expect(page.getByRole('radiogroup')).toContainText(
      'Ich bin Feuerwehrdienstleistende:r oder Einsatzkraft im Rettungsdienst oder in Einheiten des Katastrophenschutzes und habe eine Dienstzeitauszeichnung nach dem Feuerwehr- und Hilfsorganisationen-Ehrenzeichengesetz (FwHOEzG) erhalten.'
    )
    await expect(page.getByRole('radiogroup')).toContainText(
      'Ich leiste als Reservist:in seit mindestens 25 Jahren regelmäßig aktiven Wehrdienst in der Bundeswehr, indem ich in dieser Zeit entweder insgesamt mindestens 500 Tage Reservisten-Dienstleistung erbracht habe oder in dieser Zeit ständige:r Angehörige:r eines Bezirks- oder Kreisverbindungskommandos war. *'
    )
    switch (requirement) {
      case 1:
        await page.getByRole('radio', { name: 'Ich bin seit mindestens 25' }).check()
        await voluntaryWorkForm(page, browser)
        break
      case 2:
        await page.getByRole('radio', { name: 'Ich bin Inhaber:in des' }).check()
        await expect(page.locator('form')).toContainText('ANGABEN ZUM EHRENZEICHEN')
        await expect(page.locator('h4')).toContainText('Urkunde')
        await expect(page.getByRole('paragraph')).toContainText(
          'Hängen Sie hier bitte Ihre eingescannte oder abfotografierte Urkunde an. Die Datei darf maximal 5 MB groß sein und muss im JPG, PNG oder PDF Format sein.'
        )
        await testImageFileSelection(page, 'Datei Anhängen *')
        break
      case 3:
        await page
          .getByRole('radio', {
            name: 'Ich bin Feuerwehrdienstleistende:r oder Einsatzkraft im Rettungsdienst oder in',
          })
          .check()
        await organizationInfo(page)
        break
      case 4:
        await page.getByRole('radio', { name: 'Ich leiste als Reservist:in' }).check()
        await expect(page.locator('form')).toContainText('ANGABEN ZUR TÄTIGKEIT')
        await expect(page.locator('h4')).toContainText('Tätigkeitsnachweis')
        await expect(page.getByRole('paragraph')).toContainText(
          'Falls vorhanden, hängen Sie hier bitte einen eingescannten oder abfotografierten Tätigkeitsnachweis an. Die Datei darf maximal 5 MB groß sein und muss im JPG, PNG oder PDF Format sein.'
        )
        await testImageFileSelection(page, 'Datei Anhängen *')
        break
    }
  }

  const sendRequest = async (page: Page) => {
    await page.getByRole('button', { name: 'Datenschutzerklärung' }).click()
    await expect(page.locator('div').filter({ hasText: 'Datenschutzerklärung für die' }).nth(1)).toBeVisible()
    await page.getByTestId('CloseIcon').click()
    await expect(page.locator('form').first()).toContainText(
      'Ich erkläre mich damit einverstanden, dass meine Daten zum Zwecke der Antragsverarbeitung gespeichert werden und akzeptiere die Datenschutzerklärung.'
    )
    await expect(page.locator('form').first()).toContainText(
      'Ich stimme zu, dass ich von der lokalen Ehrenamtskoordination über Verlosungen und regionale Angebote informiert werden darf.'
    )
    await expect(page.locator('form').first()).toContainText(
      'Ich versichere, dass alle angegebenen Informationen korrekt und vollständig sind.'
    )
    await expect(page.getByRole('button', { name: 'Antrag Abschicken' })).toBeVisible()
    await page.getByRole('checkbox', { name: 'Ich erkläre mich damit' }).check()
    await page.getByRole('checkbox', { name: 'Ich versichere, dass alle' }).check()
    await page.getByRole('button', { name: 'Antrag Abschicken' }).click()
  }

  const sentSuccessfully = async (page: Page) => {
    await expect(page.getByRole('heading')).toHaveText('Erfolgreich gesendet', { timeout: 10_000 })
    await expect(page.getByRole('paragraph')).toContainText(
      'Ihr Antrag für die Ehrenamtskarte wurde erfolgreich übermittelt.Über den Fortschritt Ihres Antrags werden Sie per E-Mail informiert.Sie können das Fenster jetzt schließen.'
    )
    await page.getByText('Ihr Antrag für die').click()
    await page.close()
  }

  test.describe.configure({ mode: 'parallel' })
  test.setTimeout(200_000)

  test('blue_initial_volunteer', async ({ page, browserName }) => {
    await personalInfo(page, browserName)

    await cardType(page, 'blue', 'initial')

    await requirements(page, 'blue', 1, browserName)

    await sendRequest(page)

    await sentSuccessfully(page)
  })

  test('blue_extension_volunteer', async ({ page, browserName }) => {
    await personalInfo(page, browserName)

    await cardType(page, 'blue', 'extension')

    await requirements(page, 'blue', 1, browserName)

    await sendRequest(page)

    await sentSuccessfully(page)
  })

  test('blue_initial_JuLeiCa', async ({ page, browserName }) => {
    await personalInfo(page, browserName)

    await cardType(page, 'blue', 'initial')

    await requirements(page, 'blue', 2, browserName)

    await sendRequest(page)

    await sentSuccessfully(page)
  })

  test('blue_initial_fire brigade', async ({ page, browserName }) => {
    await personalInfo(page, browserName)

    await cardType(page, 'blue', 'initial')

    await requirements(page, 'blue', 3, browserName)

    await sendRequest(page)

    await sentSuccessfully(page)
  })

  test('blue_initial_military', async ({ page, browserName }) => {
    await personalInfo(page, browserName)

    await cardType(page, 'blue', 'initial')

    await requirements(page, 'blue', 4, browserName)

    await sendRequest(page)

    await sentSuccessfully(page)
  })

  test('blue_initial_FSJ', async ({ page, browserName }) => {
    await personalInfo(page, browserName)

    await cardType(page, 'blue', 'initial')

    await requirements(page, 'blue', 5, browserName)

    await sendRequest(page)

    await sentSuccessfully(page)
  })

  test('gold_volunteer', async ({ page, browserName }) => {
    await personalInfo(page, browserName)

    await cardType(page, 'gold')

    await requirements(page, 'gold', 1, browserName)

    await sendRequest(page)

    await sentSuccessfully(page)
  })

  test('gold_award', async ({ page, browserName }) => {
    await personalInfo(page, browserName)

    await cardType(page, 'gold')

    await requirements(page, 'gold', 2, browserName)

    await sendRequest(page)

    await sentSuccessfully(page)
  })

  test('gold_emergencyWorker', async ({ page, browserName }) => {
    await personalInfo(page, browserName)

    await cardType(page, 'gold')

    await requirements(page, 'gold', 3, browserName)

    await sendRequest(page)

    await sentSuccessfully(page)
  })

  test('gold_military', async ({ page, browserName }) => {
    await personalInfo(page, browserName)

    await cardType(page, 'gold')

    await requirements(page, 'gold', 4, browserName)

    await sendRequest(page)

    await sentSuccessfully(page)
  })
})
