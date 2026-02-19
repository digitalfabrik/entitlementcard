/* eslint-disable @typescript-eslint/consistent-type-definitions */

interface ViteTypeOptions {
  // By adding this line, you can make the type of ImportMetaEnv strict
  // to disallow unknown keys.
  strictImportMetaEnv: unknown
}

// https://vite.dev/guide/env-and-mode#built-in-constants
interface ImportMetaEnv {
  readonly BASE_URL: string
  readonly DEV: boolean
  readonly MODE: string
  readonly PROD: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const VITE_BUILD_COMMIT: string
declare const VITE_BUILD_VERSION_NAME: string
declare const VITE_BUILD_API_BASE_URL: string | undefined
