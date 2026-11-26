import { type Page, test as base } from '@playwright/test'

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

/** Name of the step attachments, which the reporter adds as screenshots to the user manual */
export const screenshotAttachment = 'user-manual-screenshot'

// The page of the running test and its pending requests, used for the screenshots of the steps.
// Each worker runs only one test at a time, so there is only one page per process.
let currentPage: Page | undefined
let pendingRequests = 0

/** Use this test instead of the one of @playwright/test, so the steps of user manual tests contain screenshots */
export const test = base.extend<{ userManualPage: void }>({
  userManualPage: [
    async ({ page }, use) => {
      const onRequestStarted = () => {
        pendingRequests += 1
      }
      const onRequestDone = () => {
        pendingRequests -= 1
      }
      page.on('request', onRequestStarted)
      page.on('requestfinished', onRequestDone)
      page.on('requestfailed', onRequestDone)
      currentPage = page
      pendingRequests = 0
      await use()
      currentPage = undefined
    },
    { auto: true },
  ],
})

/**
 * Waits until the page has loaded its data, e.g. after logging in, so the screenshot does not show a loading page.
 * Playwright's networkidle only works for page loads, not for requests of the single page application.
 */
const waitForPendingRequests = async (page: Page): Promise<void> => {
  const pollInterval = 100
  const timeout = 5000
  for (let waited = 0; pendingRequests > 0 && waited < timeout; waited += pollInterval) {
    await page.waitForTimeout(pollInterval)
  }
}

// Buttons to switch the project, which are only shown in local development (see ProjectSwitcher)
const devOnlyElements = (page: Page) => page.getByRole('button', { name: /^Switch to / })

const takeScreenshot = async (): Promise<void> => {
  // Only user manual tests need screenshots, all other tests are not slowed down
  const page = currentPage
  if (page === undefined || !test.info().tags.includes(userManualTag)) {
    return
  }
  await waitForPendingRequests(page)
  await devOnlyElements(page).evaluateAll(elements =>
    elements.forEach(element => element.style.setProperty('visibility', 'hidden')),
  )
  // Finish animations, e.g. of closing menus
  const screenshot = await page.screenshot({ animations: 'disabled' })
  await devOnlyElements(page).evaluateAll(elements =>
    elements.forEach(element => element.style.removeProperty('visibility')),
  )
  await test.info().attach(screenshotAttachment, { body: screenshot, contentType: 'image/png' })
}

type StepOptions = {
  /**
   * When to take the screenshot shown in the user manual:
   * 'before' the action shows where to click, 'after' shows the result (e.g. a filled form),
   * false for steps without a meaningful screen (e.g. before navigating).
   */
  screenshot?: 'before' | 'after' | false
}

/**
 * Runs an action as a step of the user manual, e.g. in a page object.
 * Only steps called directly by the test appear in the user manual, nested steps only in the trace viewer.
 * Write the title as an instruction in formal German and highlight UI elements in bold,
 * e.g. "Klicken Sie auf **Speichern**."
 */
export const step = <T>(
  title: string,
  body: () => Promise<T>,
  { screenshot = 'before' }: StepOptions = {},
): Promise<T> =>
  test.step(title, async () => {
    if (screenshot === 'before') {
      await takeScreenshot()
    }
    const result = await body()
    if (screenshot === 'after') {
      await takeScreenshot()
    }
    return result
  })

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
    await step(
      `Navigieren Sie zu **${label}**.`,
      async () => {
        await page.goto(url)
      },
      { screenshot: false },
    )
  },

  /** Clicks an element as a step of the user manual. */
  async click(page: Page, role: AriaRole, name: string): Promise<void> {
    await step(`Klicken Sie auf **${name}**.`, () => page.getByRole(role, { name }).click())
  },
}
