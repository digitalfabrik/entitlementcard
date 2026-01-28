/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable prefer-arrow/prefer-arrow-functions */

/* eslint-disable @typescript-eslint/no-use-before-define */
import react from '@vitejs/plugin-react'
import {
  type DeeplLinkingConfig,
  buildConfigBayern,
  buildConfigKoblenz,
  buildConfigNuernberg,
} from 'build-configs'
import { execFile } from 'node:child_process'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { UserConfig, defineConfig } from 'vite'
import generateFile, { GenerateFile } from 'vite-plugin-generate-file'
import tsconfigPaths from 'vite-tsconfig-paths'

const execFileAsync = promisify(execFile)

export default defineConfig(async () => {
  const commitHash = await currentCommitHash()

  return {
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
      VITE_BUILD_API_BASE_URL: JSON.stringify('http://localhost:8000'),
      VITE_BUILD_VERSION_NAME: JSON.stringify('DEV'),
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

async function currentCommitHash() {
  return (
    await execFileAsync('git', ['log', '-n1', '--format=%h'], {
      cwd: join(__dirname, '..'),
      encoding: 'utf8',
    })
  ).stdout
}

function buildFilesFromConfigs(projectLinkinConfigs: DeeplLinkingConfig[]): GenerateFile[] {
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
