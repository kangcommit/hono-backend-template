import { bodyLimit } from 'hono/body-limit'
import { cors } from 'hono/cors'
import { requestId } from 'hono/request-id'
import { secureHeaders } from 'hono/secure-headers'
import { env } from '../config/env.js'
import { logger } from '../observability/logger.js'
import { problemResponse } from './problem.js'
import type { App } from './types.js'

export function configureMiddleware(app: App) {
  app.use('*', requestId({ headerName: 'X-Request-ID' }))
  app.use('*', async (c, next) => {
    const start = performance.now()
    await next()

    logger.info({
      event: 'http.request',
      requestId: c.get('requestId'),
      method: c.req.method,
      status: c.res.status,
      durationMs: Math.round(performance.now() - start),
    })
  })
  app.use('*', secureHeaders())
  app.use(
    '*',
    cors({
      origin: env.corsOrigin,
      allowHeaders: ['Authorization', 'Content-Type'],
      credentials: true,
    }),
  )
  app.use(
    '*',
    bodyLimit({
      maxSize: 1024 * 1024,
      onError: (c) => problemResponse(c, 413, 'Request body too large'),
    }),
  )
}
