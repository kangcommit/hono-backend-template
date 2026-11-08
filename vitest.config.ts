import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    env: {
      CORS_ORIGIN: 'http://localhost:5173',
      BETTER_AUTH_URL: 'http://localhost:8000',
      BETTER_AUTH_SECRET: 'test-secret-must-be-at-least-32-characters-long',
    },
  },
})
