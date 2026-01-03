import type { UToolsApi } from 'utools-api-types'

declare global {
  const utools: UToolsApi
  interface Window {
    utools: UToolsApi
  }
}
