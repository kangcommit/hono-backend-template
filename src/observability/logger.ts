import pino from 'pino'
import { env } from '../config/env.js'

export const logger = pino({
  level: env.logLevel,
  ...(env.nodeEnv !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
      },
    },
  }),
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'password', 'token', 'secret'],
    censor: '[Redacted]',
  },
  base: { service: 'hono-api' },
})
