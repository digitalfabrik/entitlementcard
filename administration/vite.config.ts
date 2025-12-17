/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable @typescript-eslint/no-use-before-define */

/* eslint-disable prefer-arrow/prefer-arrow-functions */

/* eslint-disable no-else-return */
import react from '@vitejs/plugin-react'
import { execFile } from 'node:child_process'
import { join } from 'node:path'
import { env } from 'node:process'
import { promisify } from 'node:util'
import { UserConfig, defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import versionJson from '../version.json'

const execFileAsync = promisify(execFile)

type ViteMode = 'development' | 'production'

export default defineConfig(async configEnv => {
  const commitHash = await currentCommitHash()

  return {
    appType: 'spa',
    plugins: [react(), tsconfigPaths()],
    build: {
      assetsInlineLimit: 10000,
    },
    define: {
      VITE_BUILD_API_BASE_URL: JSON.stringify(apiBaseUrl(configEnv.mode as ViteMode)),
      VITE_BUILD_VERSION_NAME: JSON.stringify(versionName(configEnv.mode as ViteMode)),
      VITE_BUILD_COMMIT: JSON.stringify(commitHash),
    },
    preview: {
      open: true,
    },
    server: {
      port: 3000,
    },
  } satisfies UserConfig
})

function apiBaseUrl(mode: ViteMode): string | undefined {
  if (mode === 'development') {
    console.log('vite.config.ts: VITE_BUILD_API_BASE_URL="http://localhost:8000"')
  } else {
    console.log('vite.config.ts: VITE_BUILD_API_BASE_URL=undefined (use release constants)')
    return undefined
  }
}

function versionName(mode: ViteMode): string {
  if (mode === 'development') {
    console.log('vite.config.ts: VITE_BUILD_VERSION_NAME="development"')
    return 'development'
  } else if (env.NEW_VERSION_NAME) {
    console.log(
      `vite.config.ts: VITE_BUILD_VERSION_NAME="${env.NEW_VERSION_NAME}" (from env variable NEW_VERSION_NAME)`,
    )
    return env.NEW_VERSION_NAME
  } else {
    console.log(
      `vite.config.ts: VITE_BUILD_VERSION_NAME="${versionJson.versionName}" (from ../version.json)`,
    )
    return versionJson.versionName
  }
}

async function currentCommitHash() {
  return (
    await execFileAsync('git', ['log', '-n1', '--format=%h'], {
      cwd: join(__dirname, '..'),
      encoding: 'utf8',
    })
  ).stdout
}
