import { OpenAPIHono } from '@hono/zod-openapi'
import { healthLiveRoute, healthReadyRoute } from './routes.js'
import { isDatabaseReady } from './service.js'

export function createHealthRouter() {
  const router = new OpenAPIHono()

  router.openapi(healthLiveRoute, (c) => c.json({ status: 'ok' }, 200))

  router.openapi(healthReadyRoute, async (c) => {
    if (await isDatabaseReady()) {
      return c.json({ status: 'ok' }, 200)
    }

    return c.json({ status: 'unavailable' }, 503)
  })

  return router
}
