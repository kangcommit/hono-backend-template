import { serve } from '@hono/node-server'
import { createApp } from './app.js'
import { env } from './config/env.js'
import { prisma } from './db/prisma.js'
import { logger } from './observability/logger.js'

const app = createApp()

const server = serve({ fetch: app.fetch, port: env.port, hostname: env.host }, (info) => {
  logger.info({ event: 'server.started', port: info.port })
})

let shuttingDown = false
function shutdown(signal: string) {
  if (shuttingDown) return
  shuttingDown = true
  logger.info({ event: 'server.stopping', signal })
  const deadline = setTimeout(() => process.exit(1), 10_000).unref()
  server.close(async (error) => {
    try {
      await prisma.$disconnect()
      clearTimeout(deadline)
      if (error) {
        logger.error({ event: 'server.shutdown_failed', errorType: error.name })
        process.exitCode = 1
      }
    } catch {
      logger.error({ event: 'database.disconnect_failed' })
      process.exitCode = 1
    }
  })
}
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
