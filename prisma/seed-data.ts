const ADMIN_EMAIL = "admin@example.com";
const USER_EMAIL = "john@example.com";
export const DEFAULT_PASSWORD = "password123";

export const USERS = [
	{
		id: "admin-user",
		name: "Admin",
		email: ADMIN_EMAIL,
		role: "admin",
	},
	{
		id: "john-user",
		name: "John Doe",
		email: USER_EMAIL,
		role: "user",
	},
] as const;

export const POSTS = [
	{
		title: "Getting Started with Hono",
		slug: "getting-started-with-hono",
		content:
			"Learn how to build fast and lightweight APIs using the Hono framework.",
		published: true,
		authorEmail: ADMIN_EMAIL,
	},
	{
		title: "Prisma Best Practices",
		slug: "prisma-best-practices",
		content:
			"Tips for designing schemas, writing queries, and organising repositories.",
		published: true,
		authorEmail: ADMIN_EMAIL,
	},
	{
		title: "Building REST APIs",
		slug: "building-rest-apis",
		content:
			"A practical guide to designing clean and maintainable RESTful APIs.",
		published: true,
		authorEmail: ADMIN_EMAIL,
	},
	{
		title: "OpenAPI with Hono",
		slug: "openapi-with-hono",
		content: "Generate interactive API documentation using OpenAPI and Scalar.",
		published: true,
		authorEmail: ADMIN_EMAIL,
	},
	{
		title: "Docker Development Setup",
		slug: "docker-development-setup",
		content:
			"Containerise your backend for a consistent local development environment.",
		published: false,
		authorEmail: ADMIN_EMAIL,
	},
	{
		title: "Repository Pattern",
		slug: "repository-pattern",
		content:
			"Separate persistence logic from business logic using repositories.",
		published: true,
		authorEmail: USER_EMAIL,
	},
	{
		title: "Understanding DTOs",
		slug: "understanding-dtos",
		content:
			"Why DTOs help keep your API independent from your database models.",
		published: true,
		authorEmail: USER_EMAIL,
	},
	{
		title: "Future Improvements",
		slug: "future-improvements",
		content:
			"This draft collects ideas for future enhancements to the template.",
		published: false,
		authorEmail: USER_EMAIL,
	},
] as const;
