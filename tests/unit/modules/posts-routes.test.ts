import { describe, expect, it, vi } from "vitest";
import { API_PREFIX } from "../../../src/config/constants.js";
import { prisma } from "../../../src/lib/prisma.js";
import { user } from "../../helpers/fixtures/auth.js";

vi.mock("../../../src/lib/auth.js", () => ({
	auth: {
		api: {
			getSession: vi.fn(),
			userHasPermission: vi.fn(),
		},
		handler: vi.fn(),
	},
}));

vi.mock("../../../src/middleware/require-auth.js", () => ({
	requireAuth: vi.fn(async (c, next) => {
		c.set("user", {
			id: "user-1",
			role: null,
		});

		await next();
	}),
}));

vi.mock("../../../src/middleware/require-permission.js", () => ({
	requirePermission: vi.fn(() => async (_c, next) => {
		await next();
	}),
}));

const { default: app } = await import("../../../src/app.js");

const createdAt = new Date("2026-01-01T00:00:00.000Z");
const updatedAt = new Date("2026-01-02T00:00:00.000Z");

const post = {
	id: "post-1",
	title: "Hello World",
	slug: "hello-world",
	content: "Post content",
	published: false,
	authorId: user.id,
	createdAt,
	updatedAt,
};

const postDto = {
	id: post.id,
	title: post.title,
	slug: post.slug,
	content: post.content,
	published: post.published,
	createdAt: createdAt.toISOString(),
	updatedAt: updatedAt.toISOString(),
};

describe("Posts routes", () => {
	it("lists posts", async () => {
		// Arrange
		vi.mocked(prisma.post.findMany).mockResolvedValue([post]);
		vi.mocked(prisma.post.count).mockResolvedValue(1);

		// Act
		const response = await app.request(
			`${API_PREFIX}/posts?page=1&limit=10&sort=createdAt&order=desc`,
		);

		// Assert
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({
			data: [postDto],
			meta: {
				page: 1,
				limit: 10,
				total: 1,
				totalPages: 1,
			},
		});
	});

	it("returns a post by id", async () => {
		// Arrange
		vi.mocked(prisma.post.findUnique).mockResolvedValue(post);

		// Act
		const response = await app.request(`${API_PREFIX}/posts/post-1`);

		// Assert
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({
			data: postDto,
		});
	});

	it("returns 404 when a post does not exist", async () => {
		// Arrange
		vi.mocked(prisma.post.findUnique).mockResolvedValue(null);

		// Act
		const response = await app.request(`${API_PREFIX}/posts/missing`);

		// Assert
		expect(response.status).toBe(404);
		expect(await response.json()).toEqual({
			message: "Post not found",
		});
	});

	it("creates a post", async () => {
		// Arrange
		vi.mocked(prisma.post.create).mockResolvedValue(post);

		// Act
		const response = await app.request(`${API_PREFIX}/posts`, {
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				title: post.title,
				slug: post.slug,
				content: post.content,
				published: post.published,
			}),
		});

		// Assert
		expect(response.status).toBe(201);
		expect(await response.json()).toEqual({
			data: postDto,
		});
	});

	it("updates a post", async () => {
		// Arrange
		vi.mocked(prisma.post.findUnique).mockResolvedValue(post);
		vi.mocked(prisma.post.update).mockResolvedValue({
			...post,
			title: "Updated",
		});

		// Act
		const response = await app.request(`${API_PREFIX}/posts/post-1`, {
			method: "PATCH",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({
				title: "Updated",
			}),
		});

		// Assert
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({
			data: {
				...postDto,
				title: "Updated",
			},
		});
	});

	it("deletes a post", async () => {
		// Arrange
		vi.mocked(prisma.post.findUnique).mockResolvedValue(post);
		vi.mocked(prisma.post.delete).mockResolvedValue(post);

		// Act
		const response = await app.request(`${API_PREFIX}/posts/post-1`, {
			method: "DELETE",
		});

		// Assert
		expect(response.status).toBe(200);
		expect(await response.json()).toBeNull();
	});
});
