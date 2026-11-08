import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    env: {
      CORS_ORIGIN: 'http://localhost:5173',
    },
  },
})
