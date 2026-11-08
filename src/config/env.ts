import 'dotenv/config'
import { z } from 'zod'

const schema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    HOST: z.string().min(1).default('127.0.0.1'),
    PORT: z.coerce.number().int().min(1).max(65535).default(8000),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).optional(),
    CORS_ORIGIN: z.url({ protocol: /^https?$/ }),
    BETTER_AUTH_URL: z.url({ protocol: /^https?$/ }),
    BETTER_AUTH_SECRET: z.string().min(32),
    GOOGLE_CLIENT_ID: z.string().min(1).optional(),
    GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
    DIRECT_URL: z.url({ protocol: /^postgres(ql)?$/ }).optional(),
    DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  })
  .superRefine((values, context) => {
    const hasClientId = Boolean(values.GOOGLE_CLIENT_ID)
    const hasClientSecret = Boolean(values.GOOGLE_CLIENT_SECRET)

    if (hasClientId !== hasClientSecret) {
      context.addIssue({
        code: 'custom',
        path: [hasClientId ? 'GOOGLE_CLIENT_SECRET' : 'GOOGLE_CLIENT_ID'],
        message: 'Set both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable Google OAuth.',
      })
    }
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
  betterAuthUrl: values.BETTER_AUTH_URL,
  betterAuthSecret: values.BETTER_AUTH_SECRET,
  googleClientId: values.GOOGLE_CLIENT_ID,
  googleClientSecret: values.GOOGLE_CLIENT_SECRET,
  directUrl: values.DIRECT_URL,
  databaseUrl: values.DATABASE_URL,
}
