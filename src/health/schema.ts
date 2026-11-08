import { z } from '@hono/zod-openapi'

export const healthOkSchema = z.object({ status: z.literal('ok') })
export const healthUnavailableSchema = z.object({ status: z.literal('unavailable') })
