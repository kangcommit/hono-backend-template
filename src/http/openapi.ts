import { Scalar } from '@scalar/hono-api-reference'
import type { App } from './types.js'

export function registerApiDocs(app: App) {
  app.doc31('/openapi.json', {
    openapi: '3.1.0',
    info: {
      title: 'Hono API',
      version: '0.1.0',
      description: 'OpenAPI specification for the Hono API.',
    },
  })

  app.get(
    '/docs',
    Scalar({
      pageTitle: 'Hono API Reference',
      sources: [
        { url: '/openapi.json', title: 'Hono API' },
        { url: '/api/auth/open-api/generate-schema', title: 'Authentication' },
      ],
    }),
  )
}
