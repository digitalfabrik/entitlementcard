import type {
  FullConfig,
  Reporter,
  Suite,
  TestCase,
  TestResult,
  TestStep,
} from '@playwright/test/reporter'
import * as fs from 'fs'
import * as path from 'path'

import { userManualTag } from './index'

type Options = { outputDir?: string }

/**
 * Generates the user manual as markdown from the e2e tests tagged with userManualTag.
 * Writes one file per project (tenant) and feature, e.g. user-manual/docs/nuernberg/stores.md.
 * Only passed tests are included, so the user manual never describes a broken workflow.
 */
class UserManualReporter implements Reporter {
  private readonly outputDir: string
  private rootDir = ''
  private readonly tests: TestCase[] = []

  constructor(options: Options = {}) {
    this.outputDir = path.resolve(options.outputDir ?? 'user-manual/docs')
  }

  onBegin(config: FullConfig, suite: Suite): void {
    this.rootDir = config.rootDir
    this.tests.push(...suite.allTests().filter(test => test.tags.includes(userManualTag)))
  }

  onEnd(): void {
    const testsByFile = new Map<string, TestCase[]>()
    for (const test of this.tests.filter(isPassed)) {
      const tests = testsByFile.get(test.location.file) ?? []
      testsByFile.set(test.location.file, [...tests, test])
    }

    // Replace the generated chapters of previous runs, but keep the static pages (e.g. index.md)
    fs.mkdirSync(this.outputDir, { recursive: true })
    for (const entry of fs.readdirSync(this.outputDir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        fs.rmSync(path.join(this.outputDir, entry.name), { recursive: true, force: true })
      }
    }
    for (const [file, tests] of testsByFile) {
      // e.g. nuernberg/stores.spec.ts -> nuernberg/stores.md
      const relativePath = path.relative(this.rootDir, file)
      const tenant = relativePath.split(path.sep)[0]
      const feature = path
        .basename(file)
        .replace(/\.spec\.ts$/, '')
        .split('.')[0]

      const lines: string[] = []
      renderSuite(tests[0].parent, new Set(tests), lines)
      while (lines.at(-1) === '') {
        lines.pop()
      }

      fs.mkdirSync(path.join(this.outputDir, tenant), { recursive: true })
      fs.writeFileSync(path.join(this.outputDir, tenant, `${feature}.md`), `${lines.join('\n')}\n`)
    }
  }

  printsToStdio(): boolean {
    return false
  }
}

const isPassed = (test: TestCase): boolean => test.results.at(-1)?.status === 'passed'

const fileSuiteOf = (suite: Suite): Suite => {
  let current = suite
  while (current.type !== 'file' && current.parent !== undefined) {
    current = current.parent
  }
  return current
}

const heading = (level: number, text: string): string => `${'#'.repeat(Math.min(level, 6))} ${text}`

const containsTest = (suite: Suite, tests: Set<TestCase>): boolean =>
  suite.allTests().some(test => tests.has(test))

/** Renders all describe blocks and tests of the file, which contain user manual tests */
const renderSuite = (anySuite: Suite, tests: Set<TestCase>, lines: string[]): void => {
  const render = (suite: Suite, level: number) => {
    for (const entry of suite.entries()) {
      if (entry.type === 'test') {
        if (tests.has(entry)) {
          renderTest(entry, lines, level)
        }
      } else if (containsTest(entry, tests)) {
        lines.push(heading(level, entry.title), '')
        renderChapterIntro(entry, lines)
        render(entry, level + 1)
      }
    }
  }
  render(fileSuiteOf(anySuite), 1)
}

const isUserStep = (step: TestStep): boolean => step.category === 'test.step'

/**
 * Returns the steps called directly by the test, preceded by the steps of the beforeEach hooks
 * (e.g. navigating and logging in). Steps of afterEach hooks (e.g. cleanup) are not part of the user manual.
 */
const topLevelSteps = (result: TestResult): TestStep[] =>
  result.steps.flatMap(step => {
    if (step.category === 'hook' && step.title === 'Before Hooks') {
      return step.steps.flatMap(hook => hook.steps.filter(isUserStep))
    }
    return isUserStep(step) ? [step] : []
  })

const renderChapterIntro = (suite: Suite, lines: string[]): void => {
  const intro = suite
    .allTests()
    .flatMap(test => test.results.at(-1)?.annotations ?? [])
    .find(annotation => annotation.type === 'chapter-intro')
  if (intro?.description) {
    lines.push(intro.description, '')
  }
}

const renderTest = (test: TestCase, lines: string[], level: number): void => {
  const result = test.results.at(-1)
  if (result === undefined) {
    return
  }
  lines.push(heading(level, test.title), '')

  const roles = result.annotations.filter(it => it.type === 'role').map(it => it.description)
  if (roles.length > 0) {
    const label = roles.length === 1 ? 'Verfügbar für Rolle' : 'Verfügbar für Rollen'
    lines.push(`**${label}:** ${roles.join(', ')}`, '')
  }

  const description = result.annotations.find(it => it.type === 'description')?.description
  if (description) {
    lines.push(description, '')
  }

  const steps = topLevelSteps(result).filter(
    step => !step.title.startsWith('result:') && !step.title.startsWith('setup:'),
  )
  for (const step of steps) {
    lines.push(`- ${step.title}`)
    const notes = step.steps.filter(child => child.title.startsWith('note:'))
    for (const note of notes) {
      lines.push('', `  ${note.title.replace(/^note:\s*/, '')}`)
    }
    if (notes.length > 0) {
      lines.push('')
    }
  }
  if (steps.length > 0) {
    lines.push('')
  }

  for (const step of topLevelSteps(result).filter(it => it.title.startsWith('result:'))) {
    lines.push(step.title.replace(/^result:\s*/, ''), '')
  }
}

export default UserManualReporter
