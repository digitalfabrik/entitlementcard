// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite'

import * as version from '../version.json'
import baseConfigFn from './vite.config'

export default defineConfig(async configEnv => {
  const baseConfig = await baseConfigFn(configEnv)

  return {
    ...baseConfig,
    define: {
      ...baseConfig.define,
      VITE_BUILD_API_BASE_URL: 'https://api.staging.entitlementcard.app',
      VITE_BUILD_VERSION_NAME: JSON.stringify(version.versionName),
    },
  }
})
