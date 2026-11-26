import { type Locator, type Page, test as base } from '@playwright/test'

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

/**
 * Waits until running animations are finished, e.g. expanding an accordion.
 * Otherwise, the page layout changes after scrolling to the focused element.
 */
const waitForAnimations = (page: Page): Promise<void> =>
  page.evaluate(async () => {
    const finiteAnimations = document
      .getAnimations()
      .filter(animation => animation.effect?.getComputedTiming().endTime !== Infinity)
    const timeout = new Promise(resolve => {
      setTimeout(resolve, 2000)
    })
    // Cancelled animations reject their finished promise, which can be ignored
    await Promise.race([
      Promise.allSettled(finiteAnimations.map(animation => animation.finished)),
      timeout,
    ])
  })

/**
 * Waits until no loading indicator is visible, e.g. while a form loads its data.
 * The requests may start after the page was rendered, so waiting for pending requests is not enough.
 */
const waitForLoadingIndicators = async (page: Page): Promise<void> => {
  try {
    await page.waitForFunction(
      () =>
        Array.from(document.querySelectorAll('[role="progressbar"]')).every(
          element => !element.checkVisibility(),
        ),
      undefined,
      { timeout: 10000 },
    )
  } catch {
    // Take the screenshot anyway, e.g. for a progress bar shown permanently
  }
}

// Buttons to switch the project, which are only shown in local development (see ProjectSwitcher)
const devOnlyElements = (page: Page) => page.getByRole('button', { name: /^Switch to / })

/** Scrolls to the element of the step and highlights it, returns a function to remove the highlight */
const highlight = async (focus: Locator): Promise<() => Promise<void>> => {
  const element = focus.first()
  try {
    // The element may appear with a delay (e.g. after expanding) or not exist anymore (e.g. after closing a dialog)
    await element.waitFor({ state: 'visible', timeout: 2000 })
  } catch {
    return () => Promise.resolve()
  }
  await element.scrollIntoViewIfNeeded()
  await element.evaluate(it => {
    it.style.setProperty('outline', '3px solid #d32f2f')
    it.style.setProperty('outline-offset', '2px')
  })
  return () =>
    element.evaluate(it => {
      it.style.removeProperty('outline')
      it.style.removeProperty('outline-offset')
    })
}

const takeScreenshot = async (focus: Locator | undefined): Promise<void> => {
  // Only user manual tests need screenshots, all other tests are not slowed down
  const page = currentPage
  if (page === undefined || !test.info().tags.includes(userManualTag)) {
    return
  }
  await waitForPendingRequests(page)
  await waitForLoadingIndicators(page)
  await waitForAnimations(page)
  const removeHighlight = focus === undefined ? undefined : await highlight(focus)
  await devOnlyElements(page).evaluateAll(elements =>
    elements.forEach(element => element.style.setProperty('visibility', 'hidden')),
  )
  // Finish animations, e.g. of closing menus
  const screenshot = await page.screenshot({ animations: 'disabled' })
  await removeHighlight?.()
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
  /**
   * Element the user should look at, e.g. the button to click.
   * It is scrolled into view and highlighted in the screenshot.
   */
  focus?: Locator
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
  { screenshot = 'before', focus }: StepOptions = {},
): Promise<T> =>
  test.step(title, async () => {
    if (screenshot === 'before') {
      await takeScreenshot(focus)
    }
    const result = await body()
    if (screenshot === 'after') {
      await takeScreenshot(focus)
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
    const element = page.getByRole(role, { name })
    await step(`Klicken Sie auf **${name}**.`, () => element.click(), { focus: element })
  },
}
