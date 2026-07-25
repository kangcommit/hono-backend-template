import { createRoute } from "@hono/zod-openapi";
import { requireAuth } from "../../middleware/require-auth.js";
import { requirePermission } from "../../middleware/require-permission.js";
import { requestBody } from "../../openapi/requests.js";
import {
	createdResponse,
	noContentResponse,
	notFoundResponse,
	okResponse,
	unauthorizedResponse,
} from "../../openapi/responses.js";
import { OPENAPI_TAGS } from "../../openapi/tags.js";
import { createPaginatedResponseSchema } from "../../pagination/response.js";
import { POST_PERMISSIONS } from "./permissions.js";
import {
	CreatePostSchema,
	PostListQuerySchema,
	PostParamsSchema,
	PostSchema,
	UpdatePostSchema,
} from "./schema.js";

const tags = [OPENAPI_TAGS.POSTS];

export const listPostsRoute = createRoute({
	method: "get",
	path: "/",
	tags,
	summary: "List posts",
	description: "Returns a paginated list of posts.",
	request: {
		query: PostListQuerySchema,
	},
	responses: {
		...okResponse(
			"Posts retrieved successfully.",
			createPaginatedResponseSchema(PostSchema),
		),
	},
});

export const getPostRoute = createRoute({
	method: "get",
	path: "/{id}",
	tags,
	summary: "Get post",
	description: "Returns a single post.",
	request: {
		params: PostParamsSchema,
	},
	responses: {
		...okResponse("Post retrieved successfully.", PostSchema),
		...notFoundResponse("Post not found."),
	},
});

export const createPostRoute = createRoute({
	method: "post",
	path: "/",
	tags,
	summary: "Create post",
	description: "Creates a new post.",
	middleware: [requireAuth, requirePermission(POST_PERMISSIONS.CREATE)],
	request: {
		...requestBody(CreatePostSchema),
	},
	responses: {
		...createdResponse("Post created successfully.", PostSchema),
		...unauthorizedResponse,
	},
});

export const updatePostRoute = createRoute({
	method: "patch",
	path: "/{id}",
	tags,
	summary: "Update post",
	description: "Updates an existing post.",
	middleware: [requireAuth, requirePermission(POST_PERMISSIONS.UPDATE)],
	request: {
		params: PostParamsSchema,
		...requestBody(UpdatePostSchema),
	},
	responses: {
		...okResponse("Post updated successfully.", PostSchema),
		...unauthorizedResponse,
		...notFoundResponse("Post not found."),
	},
});

export const deletePostRoute = createRoute({
	method: "delete",
	path: "/{id}",
	tags,
	summary: "Delete post",
	description: "Deletes a post.",
	middleware: [requireAuth, requirePermission(POST_PERMISSIONS.DELETE)],
	request: {
		params: PostParamsSchema,
	},
	responses: {
		...noContentResponse("Post deleted successfully."),
		...unauthorizedResponse,
		...notFoundResponse("Post not found."),
	},
});
