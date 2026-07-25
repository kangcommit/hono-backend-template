# Example Domain

The `posts` module is a reference implementation demonstrating how to build a feature using this template.

It is intentionally simple and is not intended to represent a complete blogging system. Instead, it showcases the recommended project structure, coding conventions, and interaction between the different application layers.

---

# Module Structure

```text
posts/
├── constants.ts
├── dto.ts
├── filters.ts
├── permissions.ts
├── repository.ts
├── router.ts
├── routes.ts
├── schema.ts
└── service.ts
```

Each file has a single responsibility.

| File | Responsibility |
|------|----------------|
| `constants.ts` | Feature-specific constants and defaults |
| `dto.ts` | Maps database models to API responses |
| `filters.ts` | Builds reusable Prisma query filters |
| `permissions.ts` | Defines permissions used by the module |
| `repository.ts` | Handles database access |
| `router.ts` | Connects routes to services |
| `routes.ts` | Defines OpenAPI endpoints and middleware |
| `schema.ts` | Defines request and response schemas |
| `service.ts` | Implements business logic |

---

# Request Lifecycle

A request passes through several layers before reaching the database.

```text
HTTP Request
    │
    ▼
Router
    │
    ▼
Middleware
    │
    ▼
Validation
    │
    ▼
Service
    │
    ▼
Repository
    │
    ▼
Database
```

Each layer has a specific responsibility and should remain focused on that responsibility.

---

# Authorization

Authorization is performed in two stages.

## Route-level authorization

Routes verify whether a user has permission to perform an action.

For example:

- Create Post
- Update Post
- Delete Post

This is handled by permission middleware before business logic is executed.

---

## Resource-level authorization

Services verify whether the authenticated user is allowed to modify a specific resource.

For example:

- Users may edit their own posts.
- Administrators may edit any post.

Keeping ownership checks inside the service layer ensures business rules remain consistent regardless of how the service is used.

---

# Data Flow

Database models are never returned directly to API consumers.

Instead, data flows through a DTO before being returned.

```text
Prisma Model
      │
      ▼
Repository
      │
      ▼
DTO
      │
      ▼
Response Helper
      │
      ▼
JSON Response
```

This prevents persistence models from leaking into the public API and allows the API contract to evolve independently from the database schema.

---

# Creating a New Module

The recommended approach is to use the example module as a starting point.

1. Copy the `posts` module.
2. Rename it to match your feature.
3. Replace the Prisma model.
4. Update the validation schemas.
5. Implement the required business rules.
6. Define feature-specific permissions.
7. Register the router.

Following the same structure keeps every module consistent and predictable.

---

# What to Reuse

The following patterns are intended to be reused across new modules:

- Router structure
- Repository pattern
- Service pattern
- DTO mapping
- Response helpers
- Pagination utilities
- OpenAPI conventions
- Validation structure

Only the feature-specific business logic, schemas, and persistence model should change.