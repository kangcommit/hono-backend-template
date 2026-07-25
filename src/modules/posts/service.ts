import { isAdmin } from "../../auth/roles.js";
import { ForbiddenError, NotFoundError } from "../../errors/http-errors.js";
import type { AuthUser } from "../../lib/auth.js";
import { translatePrismaError } from "../../lib/prisma-error.js";
import {
	createPaginationMeta,
	getPagination,
} from "../../pagination/pagination.js";
import { getSorting } from "../../pagination/sorting.js";
import {
	DEFAULT_POST_SORT_FIELD,
	DEFAULT_POST_SORT_ORDER,
} from "./constants.js";
import { toPost } from "./dto.js";
import { postRepository } from "./repository.js";
import type { CreatePost, PostListQuery, UpdatePost } from "./schema.js";

async function ensureCanManagePost(id: string, user: AuthUser) {
	const post = await postRepository.findById(id);

	if (!post) {
		throw new NotFoundError("Post not found");
	}

	if (!isAdmin(user) && post.authorId !== user.id) {
		throw new ForbiddenError("You do not have permission to modify this post.");
	}

	return post;
}

async function findMany(query: PostListQuery) {
	const { skip, take } = getPagination(query);

	const { orderBy } = getSorting(query.sort, query.order, {
		defaultField: DEFAULT_POST_SORT_FIELD,
		defaultOrder: DEFAULT_POST_SORT_ORDER,
	});

	const [posts, total] = await Promise.all([
		postRepository.findMany(
			{
				search: query.search,
				published: query.published,
			},
			{
				skip,
				take,
				orderBy,
			},
		),
		postRepository.count({
			search: query.search,
			published: query.published,
		}),
	]);

	return {
		data: posts.map(toPost),
		meta: createPaginationMeta({
			page: query.page,
			limit: query.limit,
			total,
		}),
	};
}

async function findById(id: string) {
	const post = await postRepository.findById(id);

	if (!post) {
		throw new NotFoundError("Post not found");
	}

	return toPost(post);
}

async function create(userId: string, input: CreatePost) {
	try {
		const post = await postRepository.create({
			...input,
			author: {
				connect: {
					id: userId,
				},
			},
		});

		return toPost(post);
	} catch (error) {
		translatePrismaError(error, {
			conflict: "A post with this slug already exists.",
		});
	}
}

async function update(id: string, user: AuthUser, input: UpdatePost) {
	await ensureCanManagePost(id, user);

	try {
		const post = await postRepository.update(id, {
			...input,
		});

		return toPost(post);
	} catch (error) {
		translatePrismaError(error, {
			conflict: "A post with this slug already exists.",
		});
	}
}

async function deletePost(id: string, user: AuthUser) {
	await ensureCanManagePost(id, user);

	await postRepository.delete(id);
}

export const postService = {
	findMany,
	findById,
	create,
	update,
	delete: deletePost,
};
