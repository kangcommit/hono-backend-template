import { OpenAPIHono } from '@hono/zod-openapi'
import { registerErrorHandlers } from './http/errors.js'
import { configureMiddleware } from './http/middleware.js'
import { registerApiDocs } from './http/openapi.js'
import { problemResponse } from './http/problem.js'
import { registerRoutes } from './http/router.js'

export function createApp() {
  const app = new OpenAPIHono({
    defaultHook: (result, c) => {
      if (!result.success) {
        return problemResponse(c, 400, 'Request validation failed')
      }
    },
  })

  configureMiddleware(app)
  registerRoutes(app)
  registerApiDocs(app)
  registerErrorHandlers(app)

  return app
}
