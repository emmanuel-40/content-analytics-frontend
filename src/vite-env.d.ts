/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  readonly NEXT_PUBLIC_API_URL?: string
  readonly VITE_WS_URL?: string
  readonly VITE_PAYSTACK_PUBLIC_KEY?: string
  readonly VITE_GOOGLE_OAUTH_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
