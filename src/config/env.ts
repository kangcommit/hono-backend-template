import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HOST: z.string().min(1).default('127.0.0.1'),
  PORT: z.coerce.number().int().min(1).max(65535).default(8000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).optional(),
  CORS_ORIGIN: z.url({ protocol: /^https?$/ }),
  DIRECT_URL: z.url({ protocol: /^postgres(ql)?$/ }).optional(),
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
})

const result = schema.safeParse(process.env)
if (!result.success) {
  throw new Error(
    `Invalid environment: ${result.error.issues.map((issue) => issue.path.join('.')).join(', ')}`,
  )
}

const values = result.data
export const env = {
  nodeEnv: values.NODE_ENV,
  host: values.HOST,
  port: values.PORT,
  logLevel: values.LOG_LEVEL ?? (values.NODE_ENV === 'production' ? 'info' : 'debug'),
  corsOrigin: values.CORS_ORIGIN,
  directUrl: values.DIRECT_URL,
  databaseUrl: values.DATABASE_URL,
}
