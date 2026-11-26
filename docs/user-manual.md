# User Manual

The user manual of the administration is generated from the e2e tests and published at
https://digitalfabrik.github.io/entitlementcard/.
Only workflows covered by a passing e2e test are part of it, so the manual never describes a broken workflow.

## Content

- [How it works](#how-it-works)
- [Writing user manual tests](#writing-user-manual-tests)
- [Styleguide](#styleguide)
- [Generating the user manual locally](#generating-the-user-manual-locally)
- [Deployment](#deployment)

## How it works

1. E2e tests tagged with `@doc` describe their steps, roles and results with the helpers in
   [`e2e-tests/shared/user-manual`](../administration/e2e-tests/shared/user-manual/index.ts).
2. The [user manual reporter](../administration/e2e-tests/shared/user-manual/reporter.ts) writes one markdown file per
   test file to `administration/user-manual/docs/<project>/<test file>.md`, e.g. `nuernberg/stores.md`,
   and the screenshots of the steps to `administration/user-manual/docs/<project>/images`.
   These files are not checked in.
3. [MkDocs](https://www.mkdocs.org/) with the [Material theme](https://squidfunk.github.io/mkdocs-material/) builds
   the website from the generated chapters, the start page `administration/user-manual/docs/index.md` and the
   navigation in `administration/user-manual/mkdocs.yml`.
4. The CircleCI job `deploy_user_manual` deploys the website to the `gh-pages` branch after `e2e_administration`
   passed on `main`.

## Writing user manual tests

### Adding a test to the user manual

Add the `userManualTag` to the test. Tests without the tag are never part of the user manual.

```typescript
import { roles, testDoc, userManualTag } from '../shared/user-manual'

test('Neue Akzeptanzstelle anlegen', { tag: [userManualTag] }, async ({ storesPage }) => {
  // …
})
```

Each test file is one chapter. Describe and test titles are used as headings, so write them in German:

```
# {describe title}         ← chapter, with the describe description
## {test title}            ← section
**Verfügbar für Rolle:** … ← testDoc.role()
{description}              ← testDoc.description()
- {steps}                  ← step(), with testDoc.note() below
{result}                   ← testDoc.result()
```

If a test file contains a new chapter, add it to the `nav` in `administration/user-manual/mkdocs.yml`.
The CI build fails if a chapter in the navigation is missing.

### Steps

Each step called directly by the test or by a `beforeEach` hook is one bullet in the user manual.
Steps nested in other steps and steps in `afterEach` hooks only appear in the trace viewer.

Wrap user actions in page objects with `step`, so all tests using the page object describe the same action:

```typescript
async saveDialog(): Promise<void> {
  await step('Klicken Sie auf **Speichern**.', () => this.page.getByRole('button', { name: 'Speichern' }).click())
}
```

If an action consists of several interactions, wrap them in a single step, e.g. filling a form.
For simple actions directly in the test, `testDoc.click(page, role, name)` and `testDoc.goto(page, url, label)`
create the step title from the element name.

### Screenshots

Each step takes a screenshot of the visible page, which is shown below the step in the user manual.
By default, the screenshot is taken before the action, so it shows where to click. Choose another moment if needed:

```typescript
step('Füllen Sie das Formular aus.', () => this.fillFormFields(store), { screenshot: 'after' }) // the filled form
step('Öffnen Sie **Akzeptanzpartner verwalten**.', () => this.page.goto(url), { screenshot: false }) // empty page
```

Screenshots are only taken in tests with the `userManualTag`, which use the `test` of the
[fixtures](../administration/e2e-tests/shared/fixtures) or of `e2e-tests/shared/user-manual`.
Before the screenshot, pending requests are awaited, animations are finished and the project switcher of local
development is hidden.

### Helpers

| Helper                                    | Usage                                                                                 |
|-------------------------------------------|---------------------------------------------------------------------------------------|
| `testDoc.description(text)`               | Introduction of a test. Pass the return value as describe options for a chapter intro. |
| `testDoc.role(roles.…)`                   | Role allowed to perform the workflow. Call it once per role.                          |
| `testDoc.note(text)`                      | Explanation below the surrounding step, e.g. required fields.                         |
| `testDoc.setup(label, body)`              | Preconditions of the test, which are not part of the user manual.                     |
| `testDoc.result(text, body)`              | Assertions of the test. The text describes the outcome at the end of the section.     |

```typescript
test.describe(
  'Akzeptanzstellen verwalten',
  testDoc.description('Akzeptanzstellen sind Orte, an denen Berechtigte Vergünstigungen erhalten …'),
  () => {
    test('Akzeptanzstelle löschen', { tag: [userManualTag] }, async ({ storesPage }) => {
      testDoc.role(roles.projectStoreManager)
      testDoc.description('**Achtung:** Das Löschen kann nicht rückgängig gemacht werden.')
      await testDoc.setup('Akzeptanzstelle für den Test anlegen', async () => {
        // …
      })

      await storesPage.search(stores.delete.name)
      await storesPage.openRowMenu(stores.delete.name)
      await storesPage.clickDeleteMenuItem()
      await storesPage.confirmDelete()

      await testDoc.result('Das System entfernt die Akzeptanzstelle.', async () => {
        await expect(storesPage.successToast('gelöscht')).toBeVisible()
      })
    })
  },
)
```

Generated section (the first two steps come from the `beforeEach` hook):

```markdown
## Akzeptanzstelle löschen

**Verfügbar für Rolle:** Akzeptanzpartnerverwaltung

**Achtung:** Das Löschen kann nicht rückgängig gemacht werden.

- Öffnen Sie **Akzeptanzpartner verwalten**.
- Geben Sie Ihre **Email-Adresse** und Ihr **Passwort** ein und klicken Sie auf **Anmelden**.
- Suchen Sie die Akzeptanzstelle über das Suchfeld.
- Klicken Sie auf das **Drei-Punkte-Menü** am Anfang der Zeile.
- Klicken Sie im Menü auf **Löschen**.

  Ein Bestätigungsdialog erscheint.

- Klicken Sie im Dialog auf **Löschen**.

Das System entfernt die Akzeptanzstelle.
```

Only one variant of parameterized tests should be part of the user manual, otherwise the section is repeated.

## Styleguide

- Write in German and address the reader formally ("Sie").
- Use active voice and present tense: "Das System zeigt eine Erfolgsmeldung an." instead of
  "Eine Erfolgsmeldung wird angezeigt."
- Write steps as instructions, one action per step: "Klicken Sie auf **Speichern**."
- Name UI elements exactly as shown in the administration and format them in **bold**.
- Mention required fields only once in a note ("Alle mit * markierten Felder sind Pflichtfelder."), not per field.
- Keep sentences short and avoid technical terms. Spell out abbreviations on first use.
- Do not mention workarounds of the tests, e.g. switching the project in local development.

## Generating the user manual locally

1. Run the [backend and the administration](development-setup.md#run-e2e-tests-for-administration) with the dev data.
2. Generate the chapters (in `administration`):
   ```shell
   npm run test:e2e:docs -- --ignore-snapshots
   ```
   `--ignore-snapshots` is needed on macOS and Windows, as the PDF snapshots are only stored for Linux (CI).
3. Install MkDocs and serve the user manual on http://localhost:8000
   (stop the backend first or use `mkdocs serve -a localhost:8001`):
   ```shell
   pip install mkdocs-material==9.8.1
   cd administration/user-manual
   mkdocs serve
   ```

Keep the `mkdocs-material` version in sync with the CircleCI job `deploy_user_manual`.

## Deployment

The CircleCI job `deploy_user_manual` runs in the `commit_main` workflow after `e2e_administration` passed:

1. `e2e_administration` generates the chapters and persists them to the workspace.
2. `mkdocs build --strict` checks that all chapters of the navigation exist.
3. `mkdocs gh-deploy --force` pushes the website to the `gh-pages` branch, authenticated with an installation access
   token of the [Deliverino](https://github.com/apps/deliverino) app (CircleCI context `deliverino`).
   The branch only contains the latest version.

GitHub Pages has to be enabled once by a repository admin: *Settings → Pages → Build and deployment*,
source "Deploy from a branch", branch `gh-pages`, folder `/ (root)`.
