import z from "zod";
import { ListQuerySchema, SortOrderSchema } from "../../pagination/index.js";
import {
	DEFAULT_POST_SORT_FIELD,
	DEFAULT_POST_SORT_ORDER,
	POST_SLUG_REGEX,
	POST_SORT_FIELDS,
} from "./constants.js";

export const PostSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		slug: z.string(),
		content: z.string(),
		published: z.boolean(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	})
	.meta({ id: "Post" });

export const CreatePostSchema = z
	.object({
		title: z.string().trim().min(1).max(255),
		slug: z.string().trim().regex(POST_SLUG_REGEX),
		content: z.string().trim().min(1),
		published: z.boolean().optional().default(false),
	})
	.meta({ id: "CreatePost" });

export const UpdatePostSchema = CreatePostSchema.partial().meta({
	id: "UpdatePost",
});

export const PostListQuerySchema = ListQuerySchema.extend({
	sort: z.enum(POST_SORT_FIELDS).default(DEFAULT_POST_SORT_FIELD),
	order: SortOrderSchema.default(DEFAULT_POST_SORT_ORDER),
	search: z.string().trim().optional(),
	published: z.stringbool().optional(),
}).meta({ id: "PostListQuery" });

export const PostParamsSchema = z.object({
	id: z.string(),
});

export type PostParams = z.infer<typeof PostParamsSchema>;
export type Post = z.infer<typeof PostSchema>;
export type CreatePost = z.infer<typeof CreatePostSchema>;
export type UpdatePost = z.infer<typeof UpdatePostSchema>;
export type PostListQuery = z.infer<typeof PostListQuerySchema>;
