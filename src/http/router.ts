import { createHealthRouter } from '../health/router.js'
import type { App } from './types.js'

export function registerRoutes(app: App) {
  app.route('/health', createHealthRouter())
}
