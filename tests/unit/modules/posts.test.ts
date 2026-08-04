import { describe, expect, it, vi } from "vitest";
import {
	ForbiddenError,
	NotFoundError,
} from "../../../src/errors/http-errors.js";
import type { Post } from "../../../src/generated/prisma/client.js";
import { prisma } from "../../../src/lib/prisma.js";
import { buildWhere } from "../../../src/modules/posts/filters.js";
import { postRepository } from "../../../src/modules/posts/repository.js";
import { postService } from "../../../src/modules/posts/service.js";
import { user } from "../../helpers/fixtures/auth.js";
import { uniqueConstraintError } from "../../helpers/prisma-error.js";

const createdAt = new Date("2026-01-01T00:00:00.000Z");
const updatedAt = new Date("2026-01-02T00:00:00.000Z");

function createPost(overrides: Partial<Post> = {}): Post {
	return {
		id: "post-1",
		title: "Hello World",
		slug: "hello-world",
		content: "Post content",
		published: false,
		authorId: user.id,
		createdAt,
		updatedAt,
		...overrides,
	};
}

const postDto = {
	id: "post-1",
	title: "Hello World",
	slug: "hello-world",
	content: "Post content",
	published: false,
	createdAt: createdAt.toISOString(),
	updatedAt: updatedAt.toISOString(),
};

describe("buildWhere", () => {
	it("builds filters for published state and search", () => {
		// Act
		const result = buildWhere({
			published: true,
			search: "hello",
		});

		// Assert
		expect(result).toEqual({
			published: true,
			OR: [
				{
					title: {
						contains: "hello",
						mode: "insensitive",
					},
				},
				{
					content: {
						contains: "hello",
						mode: "insensitive",
					},
				},
			],
		});
	});

	it("returns an empty filter when no filters are provided", () => {
		// Act & Assert
		expect(buildWhere({})).toEqual({});
	});
});

describe("postRepository", () => {
	it("finds many posts with filters, sorting, and pagination", async () => {
		// Arrange
		const posts = [createPost()];
		vi.mocked(prisma.post.findMany).mockResolvedValue(posts);

		// Act
		const result = await postRepository.findMany(
			{
				search: "hello",
				published: true,
			},
			{
				skip: 10,
				take: 5,
				orderBy: {
					createdAt: "desc",
				},
			},
		);

		// Assert
		expect(prisma.post.findMany).toHaveBeenCalledWith({
			where: buildWhere({
				search: "hello",
				published: true,
			}),
			orderBy: {
				createdAt: "desc",
			},
			skip: 10,
			take: 5,
		});
		expect(result).toBe(posts);
	});

	it("delegates count, find, create, update, delete, and ownership queries", async () => {
		// Arrange
		const post = createPost();
		vi.mocked(prisma.post.count).mockResolvedValue(1);
		vi.mocked(prisma.post.findUnique).mockResolvedValue(post);
		vi.mocked(prisma.post.create).mockResolvedValue(post);
		vi.mocked(prisma.post.update).mockResolvedValue(post);
		vi.mocked(prisma.post.delete).mockResolvedValue(post);
		vi.mocked(prisma.post.findFirst).mockResolvedValue(post);

		// Act & Assert
		await expect(postRepository.count({ published: true })).resolves.toBe(1);
		expect(prisma.post.count).toHaveBeenCalledWith({
			where: {
				published: true,
			},
		});

		await expect(postRepository.findById(post.id)).resolves.toBe(post);
		expect(prisma.post.findUnique).toHaveBeenCalledWith({
			where: { id: post.id },
		});

		await expect(postRepository.create({ title: post.title })).resolves.toBe(
			post,
		);
		expect(prisma.post.create).toHaveBeenCalledWith({
			data: { title: post.title },
		});

		await expect(
			postRepository.update(post.id, { title: "Updated" }),
		).resolves.toBe(post);
		expect(prisma.post.update).toHaveBeenCalledWith({
			where: { id: post.id },
			data: { title: "Updated" },
		});

		await expect(postRepository.delete(post.id)).resolves.toBe(post);
		expect(prisma.post.delete).toHaveBeenCalledWith({
			where: { id: post.id },
		});

		await expect(postRepository.findOwnedById(post.id, user.id)).resolves.toBe(
			post,
		);
		expect(prisma.post.findFirst).toHaveBeenCalledWith({
			where: {
				id: post.id,
				authorId: user.id,
			},
		});
	});
});

describe("postService", () => {
	it("returns paginated post DTOs", async () => {
		// Arrange
		vi.mocked(prisma.post.findMany).mockResolvedValue([createPost()]);
		vi.mocked(prisma.post.count).mockResolvedValue(11);

		// Act
		const result = await postService.findMany({
			page: 2,
			limit: 10,
			sort: "createdAt",
			order: "desc",
			search: "hello",
			published: true,
		});

		// Assert
		expect(result).toEqual({
			data: [postDto],
			meta: {
				page: 2,
				limit: 10,
				total: 11,
				totalPages: 2,
			},
		});
	});

	it("returns a post by id", async () => {
		// Arrange
		vi.mocked(prisma.post.findUnique).mockResolvedValue(createPost());

		// Act & Assert
		await expect(postService.findById("post-1")).resolves.toEqual(postDto);
	});

	it("throws NotFoundError when a post does not exist", async () => {
		// Arrange
		vi.mocked(prisma.post.findUnique).mockResolvedValue(null);

		// Act & Assert
		await expect(postService.findById("missing")).rejects.toThrow(
			new NotFoundError("Post not found"),
		);
	});

	it("creates a post for the current user", async () => {
		// Arrange
		vi.mocked(prisma.post.create).mockResolvedValue(createPost());

		// Act
		const result = await postService.create(user.id, {
			title: "Hello World",
			slug: "hello-world",
			content: "Post content",
			published: false,
		});

		// Assert
		expect(prisma.post.create).toHaveBeenCalledWith({
			data: {
				title: "Hello World",
				slug: "hello-world",
				content: "Post content",
				published: false,
				author: {
					connect: {
						id: user.id,
					},
				},
			},
		});
		expect(result).toEqual(postDto);
	});

	it("translates create conflicts", async () => {
		// Arrange
		vi.mocked(prisma.post.create).mockRejectedValue(uniqueConstraintError());

		// Act & Assert
		await expect(
			postService.create(user.id, {
				title: "Hello World",
				slug: "hello-world",
				content: "Post content",
			}),
		).rejects.toThrow("A post with this slug already exists.");
	});

	it("updates a post owned by the current user", async () => {
		// Arrange
		vi.mocked(prisma.post.findUnique).mockResolvedValue(createPost());
		vi.mocked(prisma.post.update).mockResolvedValue(
			createPost({
				title: "Updated",
			}),
		);

		// Act
		const result = await postService.update("post-1", user, {
			title: "Updated",
		});

		// Assert
		expect(prisma.post.update).toHaveBeenCalledWith({
			where: { id: "post-1" },
			data: {
				title: "Updated",
			},
		});
		expect(result).toEqual({
			...postDto,
			title: "Updated",
		});
	});

	it("allows admins to update another user's post", async () => {
		// Arrange
		vi.mocked(prisma.post.findUnique).mockResolvedValue(
			createPost({
				authorId: "another-user",
			}),
		);
		vi.mocked(prisma.post.update).mockResolvedValue(createPost());

		// Act & Assert
		await expect(
			postService.update(
				"post-1",
				{
					...user,
					role: "admin",
				},
				{
					published: true,
				},
			),
		).resolves.toEqual(postDto);
	});

	it("forbids non-owners from updating a post", async () => {
		// Arrange
		vi.mocked(prisma.post.findUnique).mockResolvedValue(
			createPost({
				authorId: "another-user",
			}),
		);

		// Act & Assert
		await expect(
			postService.update("post-1", user, {
				title: "Updated",
			}),
		).rejects.toThrow(ForbiddenError);
		expect(prisma.post.update).not.toHaveBeenCalled();
	});

	it("deletes a post owned by the current user", async () => {
		// Arrange
		vi.mocked(prisma.post.findUnique).mockResolvedValue(createPost());
		vi.mocked(prisma.post.delete).mockResolvedValue(createPost());

		// Act
		await postService.delete("post-1", user);

		// Assert
		expect(prisma.post.delete).toHaveBeenCalledWith({
			where: { id: "post-1" },
		});
	});
});
