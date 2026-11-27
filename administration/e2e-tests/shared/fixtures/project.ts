import { type BrowserContext } from '@playwright/test'

/**
 * Selects the project of the administration before any page is loaded.
 * Locally, all projects run on localhost, so the project is chosen via local storage (see ProjectSwitcher).
 */
export const selectProject = async (context: BrowserContext, projectId: string): Promise<void> => {
  await context.addInitScript(
    project => window.localStorage.setItem('project-override', project),
    projectId,
  )
}
