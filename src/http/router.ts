import { auth } from '../auth/auth.js'
import { createHealthRouter } from '../health/router.js'
import type { App } from './types.js'

export function registerRoutes(app: App) {
  app.all('/api/auth/*', (c) => auth.handler(c.req.raw))
  app.route('/health', createHealthRouter())
}
