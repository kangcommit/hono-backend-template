# Hono API Template

## Overview

A Node.js API built with Hono, TypeScript, and PostgreSQL through Prisma.

This template includes Better Auth with email/password sign-in and optional Google OAuth, request validation, OpenAPI documentation with Scalar, structured logging with Pino, Biome, Vitest, and Knip.

## Requirements

- Node.js `22.12.0` or newer.
- pnpm `12.16.1`, matching the `packageManager` field in `package.json`.
- PostgreSQL for Better Auth sessions, readiness checks, and database-backed routes.

## Getting started

Copy this template directory into your application repository, then run these commands from its root:

```bash
cp .env.example .env
pnpm install
```

Set `DATABASE_URL` to your PostgreSQL connection string, `CORS_ORIGIN` to the browser application's origin, and `BETTER_AUTH_URL` to `http://localhost:8000` in `.env`. Replace `BETTER_AUTH_SECRET` with a random secret of at least 32 characters; generate one with `openssl rand -base64 32`. Google OAuth is optional: set both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to enable it.

Run the initial database migration, then start the API:

```bash
pnpm db:migrate:dev
pnpm dev
```

The API starts at [http://localhost:8000](http://localhost:8000). Check [http://localhost:8000/health/live](http://localhost:8000/health/live) for liveness and [http://localhost:8000/docs](http://localhost:8000/docs) for the API reference. Better Auth endpoints are mounted at `/api/auth/*`.

Before building your product, update the package name in `package.json` and replace the example health feature with your application routes.

## Available commands

| Command                  | Purpose                                                        |
| ------------------------ | -------------------------------------------------------------- |
| `pnpm dev`               | Generate Prisma Client and start the development server.       |
| `pnpm build`             | Generate Prisma Client and compile the application to `dist/`. |
| `pnpm start`             | Start the compiled production server.                          |
| `pnpm check`             | Check formatting and lint rules with Biome.                    |
| `pnpm check:fix`         | Apply formatting and lint fixes with Biome.                    |
| `pnpm typecheck`         | Check TypeScript types.                                        |
| `pnpm test`              | Run tests that do not require PostgreSQL.                      |
| `pnpm test:integration`  | Run PostgreSQL integration tests.                              |
| `pnpm test:watch`        | Run tests in watch mode.                                       |
| `pnpm db:generate`       | Generate Prisma Client.                                        |
| `pnpm db:migrate:dev`    | Create and apply a development migration.                      |
| `pnpm db:migrate:deploy` | Apply committed migrations in a deployment environment.        |
| `pnpm knip`              | Check for unused files, exports, and dependencies.             |
| `pnpm verify`            | Run Biome, type checking, unit tests, build, and Knip checks.  |

## Authentication

Better Auth provides database-backed sessions and email/password sign-in. Google sign-in is enabled when both Google OAuth credentials are configured. In Google Cloud, register `http://localhost:8000/api/auth/callback/google` as an authorized redirect URI. For production, use the production `BETTER_AUTH_URL` with the same `/api/auth/callback/google` suffix. Clients can start the flow with Better Auth's social sign-in method and `provider: 'google'` ([social sign-on guide](https://better-auth.com/docs/basic-usage#social-sign-on)). Its endpoints appear as the **Authentication** source in the Scalar reference at `/docs`, alongside the Hono API. Browser clients calling the API from another origin must send credentials; CORS is limited to `CORS_ORIGIN`, which is also the Better Auth trusted origin. In protected route handlers, read the session with `auth.api.getSession({ headers: c.req.raw.headers })` and enforce resource permissions in the feature logic. Health routes remain public.

The [Better Auth OpenAPI plugin](https://better-auth.com/docs/plugins/open-api) is early-stage; review its generated schema before using it to generate client code.

Email verification and password reset require a transactional email provider. Add those callbacks before relying on those flows in production.

## Project structure

| Location                | Responsibility                                      |
| ----------------------- | --------------------------------------------------- |
| `src/app.ts`            | Compose middleware, routes, API docs, and handlers. |
| `src/index.ts`          | Start the Node.js server and handle shutdown.       |
| `src/auth/`             | Configure Better Auth with the Prisma adapter.      |
| `src/health/`           | Example health feature and PostgreSQL readiness.    |
| `src/http/`             | Shared routing, middleware, errors, and OpenAPI.    |
| `src/config/env.ts`     | Load and validate environment configuration.        |
| `src/db/prisma.ts`      | Create the process-wide Prisma client.              |
| `src/observability/`    | Configure the Pino logger.                          |
| `prisma/schema.prisma`  | Define database models and Prisma Client settings.  |
| `prisma/migrations/`    | Store reviewed PostgreSQL schema migrations.        |
| `prisma.config.ts`      | Configure Prisma CLI and migrations.                |
| `src/generated/prisma/` | Generated Prisma Client; do not edit.               |
| `tests/`                | Application and database integration tests.         |

## Adding a feature

1. Create `src/<feature>/` and keep related endpoint and feature code together.
2. Define OpenAPI route contracts in `<feature>/routes.ts` and request/response schemas in `<feature>/schema.ts`.
3. Implement the handlers in `<feature>/router.ts`, then mount the feature router in `src/http/router.ts`.
4. Add Prisma models and a migration when the feature needs persistent data.
5. Add tests for the feature; use `pnpm test:integration` for behavior that depends on PostgreSQL.

### Folders and dependencies

Use the existing `src/health/` feature as the example. A feature can start with just the files it needs:

```text
src/<feature>/
├── router.ts       # Bind route contracts to handlers
├── routes.ts       # OpenAPI route definitions
├── schema.ts       # Request and response schemas
├── service.ts      # Add when feature logic needs a separate boundary
└── repository.ts   # Add when database access benefits from isolation
```

Keep shared HTTP behavior in `src/http/`, environment configuration in `src/config/`, and the Prisma client in `src/db/`. Feature code may use these shared modules; keep feature-specific behavior out of shared folders. Add a service or repository when it clarifies real logic or data access, not just to add another layer to a small handler.

Prefer the existing Hono, Zod, and Prisma dependencies when they meet the need. Add a package when the feature requires it, and use `pnpm add <package>` for runtime dependencies or `pnpm add -D <package>` for development tools. Prefer direct imports; add barrel files only when they define a useful public interface.

## Configuration and conventions

| Variable               | Required | Default                                    | Purpose                                            |
| ---------------------- | -------- | ------------------------------------------ | -------------------------------------------------- |
| `DATABASE_URL`         | Yes      | —                                          | PostgreSQL connection used by the app.             |
| `CORS_ORIGIN`          | Yes      | —                                          | The single allowed browser origin.                 |
| `BETTER_AUTH_URL`      | Yes      | —                                          | Public base URL for the auth API.                  |
| `BETTER_AUTH_SECRET`   | Yes      | —                                          | Random secret of at least 32 characters.           |
| `GOOGLE_CLIENT_ID`     | Optional | —                                          | Google OAuth client ID; configure with its secret. |
| `GOOGLE_CLIENT_SECRET` | Optional | —                                          | Google OAuth client secret; configure with its ID. |
| `NODE_ENV`             | No       | `development`                              | Runtime environment.                               |
| `HOST`                 | No       | `127.0.0.1`                                | Address the server listens on.                     |
| `PORT`                 | No       | `8000`                                     | Port the server listens on.                        |
| `LOG_LEVEL`            | No       | `debug` (development), `info` (production) | Pino logging threshold.                            |
| `DIRECT_URL`           | No       | —                                          | Optional direct database URL for migrations.       |

- Use TypeScript and preserve strict type checking.
- Keep environment access centralized in `src/config/env.ts`; do not read `process.env` throughout application code.
- Keep local `.env` files and secrets out of source control. Update `.env.example` when configuration changes.
- Validate request data at the route boundary and return the existing Problem Details error format.

## Testing and verification

`pnpm test` excludes tests requiring PostgreSQL. Set `DATABASE_URL` to a disposable test database before running `pnpm test:integration`. The `pnpm verify` command does not run integration tests.

## Production

Run `pnpm build`, apply reviewed migrations with `pnpm db:migrate:deploy`, then run `pnpm start`. Configure `DATABASE_URL`, `CORS_ORIGIN`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, and any optional environment values in the deployment environment. Use a unique production secret. For a VPS, run the API under systemd or Docker Compose behind a reverse proxy with HTTPS, and keep PostgreSQL private.
