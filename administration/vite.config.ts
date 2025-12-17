import react from '@vitejs/plugin-react'
// eslint-disable-next-line import/no-extraneous-dependencies
import tsconfigPaths from 'vite-tsconfig-paths'
// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig, UserConfig } from 'vite'
import { execFile } from 'node:child_process'
import { join } from 'node:path'

const execFileAsync = promisify(execFile)

export default defineConfig(async () => {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const commitHash = await currentCommitHash()

  return {
    appType: 'spa',
    plugins: [
      react(),
      tsconfigPaths()
    ],
    build: {
      assetsInlineLimit: 10000
    },
    define: {
      VITE_BUILD_API_BASE_URL: JSON.stringify('http://localhost:8000'),
      VITE_BUILD_VERSION_NAME: JSON.stringify('DEV'),
      VITE_BUILD_COMMIT: JSON.stringify(commitHash)
    },
    preview: {
      open: true,
    },
    server: {
      port: 3000,
    },
  } satisfies UserConfig
})

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
async function currentCommitHash() {
  return (
    await execFileAsync('git', ['log', '-n1', '--format=%h'], {
      cwd: join(__dirname, '..'),
      encoding: 'utf8',
    })
  ).stdout
}
