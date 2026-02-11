/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable @typescript-eslint/no-use-before-define */

/* eslint-disable prefer-arrow/prefer-arrow-functions */

/* eslint-disable no-else-return */
import react from '@vitejs/plugin-react'
import {
  type DeepLinkingConfig,
  buildConfigBayern,
  buildConfigKoblenz,
  buildConfigNuernberg,
} from 'build-configs'
import { execFile } from 'node:child_process'
import { join } from 'node:path'
import { env } from 'node:process'
import { promisify } from 'node:util'
import { UserConfig, defineConfig } from 'vite'
import generateFile, { GenerateFile } from 'vite-plugin-generate-file'
import tsconfigPaths from 'vite-tsconfig-paths'

import versionJson from '../version.json'

const execFileAsync = promisify(execFile)

type ViteMode = 'development' | 'production'

export default defineConfig(
  async configEnv =>
    ({
      appType: 'spa',
      plugins: [
        react(),
        tsconfigPaths(),
        generateFile(
          buildFilesFromConfigs([
            buildConfigBayern.common.deepLinking,
            buildConfigNuernberg.common.deepLinking,
            buildConfigKoblenz.common.deepLinking,
          ]),
        ),
      ],
      build: {
        outDir: 'build',
        assetsInlineLimit: 10000,
      },
      define: {
        VITE_BUILD_API_BASE_URL: await defineBuildConstant('VITE_BUILD_API_BASE_URL', () =>
          apiBaseUrl(configEnv.mode as ViteMode),
        ),
        VITE_BUILD_VERSION_NAME: await defineBuildConstant('VITE_BUILD_VERSION_NAME', () =>
          versionName(configEnv.mode as ViteMode),
        ),
        VITE_BUILD_COMMIT: await defineBuildConstant('VITE_BUILD_COMMIT', () =>
          currentCommitHash(),
        ),
      },
      preview: {
        open: true,
      },
      server: {
        port: 3000,
      },
    }) satisfies UserConfig,
)

async function defineBuildConstant(
  name: string,
  fn: () => Promise<string | undefined> | string | undefined,
): Promise<string> {
  const value = JSON.stringify(await Promise.try(fn))
  console.log(`vite.config.ts: ${name}=${value}`)

  return value
}

function apiBaseUrl(mode: ViteMode): string | undefined {
  return mode === 'development' ? 'http://localhost:8000' : undefined
}

function versionName(mode: ViteMode): string {
  if (mode === 'development') {
    return 'development'
  } else if (env.NEW_VERSION_NAME) {
    console.log(`vite.config.ts: using 'NEW_VERSION_NAME' env var`)
    return env.NEW_VERSION_NAME
  } else {
    console.log(`vite.config.ts: using 'version.json'`)
    return versionJson.versionName
  }
}

async function currentCommitHash(): Promise<string> {
  return (
    await execFileAsync('git', ['log', '-n1', '--format=%h'], {
      cwd: join(__dirname, '..'),
      encoding: 'utf8',
    })
  ).stdout.trim()
}

function buildFilesFromConfigs(projectLinkinConfigs: DeepLinkingConfig[]): GenerateFile[] {
  return projectLinkinConfigs.flatMap(config => [
    {
      type: 'json',
      output: join(config.projectName, 'assetlinks.json'),
      // https://developer.android.com/training/app-links/verify-android-applinks#web-assoc
      data: [
        {
          relation: ['delegate_permission/common.handle_all_urls'],
          target: {
            namespace: 'android_app',
            package_name: config.android.applicationId,
            sha256_cert_fingerprints: [config.android.sha256CertFingerprint],
          },
        },
      ],
    },
    {
      type: 'json',
      output: join(config.projectName, 'apple-app-site-association'),
      data: {
        applinks: {
          apps: [],
          details: [
            {
              appID: config.ios.appleAppSiteAssociationAppId,
              components: [
                {
                  '/': config.ios.path,
                  comment: config.ios.pathComment,
                },
              ],
            },
          ],
        },
      },
    },
  ])
}
