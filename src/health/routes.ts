import { createRoute } from '@hono/zod-openapi'
import { healthOkSchema, healthUnavailableSchema } from './schema.js'

export const healthLiveRoute = createRoute({
  method: 'get',
  path: '/live',
  tags: ['Health'],
  summary: 'Check process liveness',
  responses: {
    200: {
      description: 'The process is responding.',
      content: { 'application/json': { schema: healthOkSchema } },
    },
  },
})

export const healthReadyRoute = createRoute({
  method: 'get',
  path: '/ready',
  tags: ['Health'],
  summary: 'Check service readiness',
  responses: {
    200: {
      description: 'The service can reach its required database.',
      content: { 'application/json': { schema: healthOkSchema } },
    },
    503: {
      description: 'A required dependency is unavailable.',
      content: { 'application/json': { schema: healthUnavailableSchema } },
    },
  },
})
