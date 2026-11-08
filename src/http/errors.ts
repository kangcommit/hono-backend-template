import { HTTPException } from 'hono/http-exception'
import { logger } from '../observability/logger.js'
import { problemResponse } from './problem.js'
import type { App } from './types.js'

export function registerErrorHandlers(app: App) {
  app.notFound((c) => problemResponse(c, 404, 'Not Found'))

  app.onError((error, c) => {
    if (error instanceof HTTPException && error.status < 500) {
      return problemResponse(c, error.status, 'Request failed')
    }

    // Exception messages can contain secrets or personal data.
    logger.error({ event: 'http.error', requestId: c.get('requestId'), errorType: error.name })
    return problemResponse(c, 500, 'Internal Server Error')
  })
}
