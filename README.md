# Hono Backend Template

![Node.js](https://img.shields.io/badge/Node.js-24+-339933?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Hono](https://img.shields.io/badge/Hono-4.x-E36002)
![License](https://img.shields.io/badge/License-MIT-green)
![CI](https://img.shields.io/github/actions/workflow/status/kangcommit/hono-backend-template/ci.yml)

A production-ready backend template built with **Hono**, **TypeScript**, and **Prisma** for developing scalable, maintainable, and type-safe REST APIs.

Whether you're building a personal project or starting a new backend service, this template provides a solid foundation with modern tooling and best practices. It includes authentication, request validation, API documentation, structured logging, Docker support, automated testing, and a module-driven architecture designed for long-term maintainability.

## Features

* 🚀 Hono framework with TypeScript
* 🏗️ Module-driven architecture
* 🔒 Authentication with Better Auth
* 🗄️ PostgreSQL with Prisma ORM
* ✅ Type-safe request validation using Zod
* 📖 OpenAPI documentation with Scalar
* 📄 Standardized API responses
* 📑 Pagination and sorting utilities
* 📝 Structured logging with Pino
* ⚙️ Environment variable validation
* 🧪 Unit and integration testing with Vitest
* 🐳 Docker and Docker Compose support
* 🔄 GitHub Actions CI
* 🎨 Biome for formatting and linting
* 🪝 Husky and lint-staged for Git hooks

## Tech Stack

| Category          | Technology       |
| ----------------- | ---------------- |
| Runtime           | Node.js          |
| Framework         | Hono             |
| Language          | TypeScript       |
| Database          | PostgreSQL       |
| ORM               | Prisma           |
| Authentication    | Better Auth      |
| Validation        | Zod              |
| API Documentation | OpenAPI + Scalar |
| Logging           | Pino             |
| Testing           | Vitest           |
| Code Quality      | Biome            |
| Containerization  | Docker           |
| CI/CD             | GitHub Actions   |

## Project Structure

```text
.
├── docs/
├── prisma/
├── src/
│   ├── auth/
│   ├── config/
│   ├── errors/
│   ├── lib/
│   ├── middleware/
│   ├── modules/
│   ├── openapi/
│   ├── pagination/
│   ├── response/
│   └── routes/
├── tests/
├── Dockerfile
├── docker-compose.yml
└── docker-compose.dev.yml
```

The project follows a **module-driven architecture**, where each feature owns its routes, schemas, and business logic. Shared infrastructure lives outside feature modules to encourage reuse and consistency.

# Rename the Template

After creating a project from this template, update the following values to match your application.

| Location                    | Update                                     |
| --------------------------- | ------------------------------------------ |
| `package.json`              | Change the project name                    |
| `README.md`                 | Change the project title and description   |
| `src/config/constants.ts`   | Update `APP_NAME`                          |

# Getting Started

## Prerequisites

* Node.js 24+
* pnpm
* PostgreSQL
* Docker (optional)

## Installation

```bash
git clone https://github.com/kangcommit/hono-backend-template

cd hono-backend-template

pnpm install
```

## Environment Variables

Copy the example environment file.

```bash
cp .env.example .env
```

Configure the required environment variables.

| Variable             | Description                           |
| -------------------- | ------------------------------------- |
| `NODE_ENV`           | Application environment               |
| `LOG_LEVEL`          | Logger level                          |
| `PORT`               | Server port                           |
| `APP_URL`            | Public URL of the backend application |
| `DATABASE_URL`       | PostgreSQL connection string          |
| `BETTER_AUTH_SECRET` | Better Auth secret                    |
| `CLIENT_URL`         | Frontend application URL              |

## Generate Prisma Client

```bash
pnpm db:generate
```

## Run Database Migrations

```bash
pnpm db:migrate
```

## Start the Development Server

```bash
pnpm dev
```

The API will be available at:

```text
<APP_URL>
```

# Docker

### Development

Start only the PostgreSQL database.

```bash
docker compose -f docker-compose.dev.yml up -d
```

### Production

Run the full application stack.

```bash
docker compose -f docker-compose.yml up --build
```

# API Documentation

Once the server is running:

| Resource              | URL                          |
| --------------------- | ---------------------------- |
| Scalar UI             | `<APP_URL>/api/docs`         |
| OpenAPI Specification | `<APP_URL>/api/openapi.json` |
| Current User          | `<APP_URL>/api/me`           |

# Authentication

Authentication is powered by **Better Auth**.

The template includes:

* Email and password authentication
* Session management
* Opt-in protected route middleware
* Current user helper
* Better Auth OpenAPI integration

Session lookup is not registered globally. Public routes stay lightweight, and protected modules opt in by using `createProtectedRouter()`.

```ts
import { createProtectedRouter } from "../../auth/protected-router.js";

export const postsRouter = createProtectedRouter();
```

The template includes `GET /api/me` as a minimal protected route example.

Authorization is application-specific and should be implemented based on your project's requirements (for example, roles, permissions, or resource ownership).

# Testing

Run the complete test suite:

```bash
pnpm test:all
```

Generate a coverage report:

```bash
pnpm test:coverage
```

For more information about the testing strategy, see:

- [docs/testing.md](docs/testing.md)

# Code Quality

Run Biome.

```bash
pnpm lint
```

Automatically fix formatting and lint issues.

```bash
pnpm lint:fix
```

Run the full verification suite.

```bash
pnpm check
```

Run TypeScript type checking.

```bash
pnpm typecheck
```

# Continuous Integration

GitHub Actions automatically performs:

* Dependency installation
* Prisma Client generation
* Linting
* Type checking
* Test execution with coverage
* Production build
* Docker image build

# Available Scripts

| Script                    | Description                           |
| ------------------------- | ------------------------------------- |
| `pnpm dev`                | Start the development server          |
| `pnpm build`              | Build the application                 |
| `pnpm start`              | Start the production server           |
| `pnpm db:generate`        | Generate Prisma Client                |
| `pnpm db:migrate`         | Run development migrations            |
| `pnpm db:deploy`          | Apply production migrations           |
| `pnpm db:studio`          | Open Prisma Studio                    |
| `pnpm test`               | Run tests in watch mode               |
| `pnpm test:unit`          | Run unit tests                        |
| `pnpm test:integration`   | Run integration tests                 |
| `pnpm test:all`           | Run all tests                         |
| `pnpm test:coverage`      | Generate a coverage report            |
| `pnpm lint`               | Run Biome                             |
| `pnpm lint:fix`           | Automatically fix formatting and lint issues |
| `pnpm check`              | Run the full verification suite       |
| `pnpm typecheck`          | Run TypeScript type checking          |

# Architecture

This template follows a module-driven architecture with a clear separation of concerns.

For more details about the project structure, design principles, and layer responsibilities, see:

- [docs/architecture.md](docs/architecture.md)

# Documentation

Additional documentation is available in the `docs` directory.

| Document | Description |
|----------|-------------|
| `docs/architecture.md` | Project architecture and design principles |
| `docs/example-domain.md` | Walkthrough of the example Posts module. |
| `docs/conventions.md` | Coding conventions and project structure |
| `docs/testing.md` | Testing strategy and guidelines |
| `CONTRIBUTING.md` | Contribution workflow and development guidelines |

A complete example implementation is available in the `feat/example-domain` branch.

## Contributing

Contributions are welcome. If you find a bug, have a suggestion, or would like to improve the template, feel free to open an issue or submit a pull request.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) before contributing.

# License

This project is licensed under the MIT License. See the LICENSE file for details.
