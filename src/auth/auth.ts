import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { openAPI } from 'better-auth/plugins'
import { env } from '../config/env.js'
import { prisma } from '../db/prisma.js'

export const auth = betterAuth({
  baseURL: env.betterAuthUrl,
  secret: env.betterAuthSecret,
  trustedOrigins: [env.corsOrigin],
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: { enabled: true },
  ...(env.googleClientId && env.googleClientSecret
    ? {
        socialProviders: {
          google: {
            clientId: env.googleClientId,
            clientSecret: env.googleClientSecret,
          },
        },
      }
    : {}),
  plugins: [openAPI()],
})
