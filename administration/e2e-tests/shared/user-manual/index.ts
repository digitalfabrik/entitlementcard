import { type Page, test } from '@playwright/test'

/**
 * Helpers to write e2e tests which also generate the user manual (see docs/user-manual.md).
 * Only tests with this tag are part of the user manual.
 */
export const userManualTag = '@doc'

type AriaRole = Parameters<Page['getByRole']>[0]

/** Role names as shown in the administration (see users in src/translations/de.json) */
export const roles = {
  projectAdmin: 'Administrator',
  regionAdmin: 'Regionsadministrator',
  regionManager: 'Regionsverwalter',
  projectStoreManager: 'Akzeptanzpartnerverwaltung',
}

/**
 * Runs an action as a step of the user manual, e.g. in a page object.
 * Only steps called directly by the test appear in the user manual, nested steps only in the trace viewer.
 * Write the title as an instruction in formal German and highlight UI elements in bold,
 * e.g. "Klicken Sie auf **Speichern**."
 */
export const step = <T>(title: string, body: () => Promise<T>): Promise<T> => test.step(title, body)

export const testDoc = {
  /**
   * Adds an introduction to a chapter (describe block) or to a single test.
   * At describe level, pass the return value as describe options.
   */
  description(text: string): { annotation: { type: string; description: string } } {
    try {
      test.info().annotations.push({ type: 'description', description: text })
    } catch {
      // Called at describe level, the return value is used as describe options
    }
    return { annotation: { type: 'chapter-intro', description: text } }
  },

  /** Adds a role which is allowed to perform the described action. Call it once per role. */
  role(name: string): void {
    test.info().annotations.push({ type: 'role', description: name })
  },

  /** Adds an explanation to the surrounding step. */
  async note(text: string): Promise<void> {
    await test.step(`note: ${text}`, () => Promise.resolve())
  },

  /** Runs preconditions of a test, which are not part of the user manual. */
  async setup(label: string, body: () => Promise<void>): Promise<void> {
    await test.step(`setup: ${label}`, body)
  },

  /** Runs the assertions of a test and describes the outcome in the user manual. */
  async result(text: string, body: () => Promise<void>): Promise<void> {
    await test.step(`result: ${text}`, body)
  },

  /** Navigates to a page as a step of the user manual. */
  async goto(page: Page, url: string, label: string): Promise<void> {
    await step(`Navigieren Sie zu **${label}**.`, async () => {
      await page.goto(url)
    })
  },

  /** Clicks an element as a step of the user manual. */
  async click(page: Page, role: AriaRole, name: string): Promise<void> {
    await step(`Klicken Sie auf **${name}**.`, () => page.getByRole(role, { name }).click())
  },
}
