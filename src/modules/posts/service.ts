import { NotFoundError } from "../../errors/http-errors.js";
import { translatePrismaError } from "../../lib/prisma-error.js";
import {
	createPaginationMeta,
	getPagination,
} from "../../pagination/pagination.js";
import { getSorting } from "../../pagination/sorting.js";
import { data, paginated } from "../../response/payload.js";
import {
	DEFAULT_POST_SORT_FIELD,
	DEFAULT_POST_SORT_ORDER,
} from "./constants.js";
import { postRepository } from "./repository.js";
import type { CreatePost, PostListQuery, UpdatePost } from "./schema.js";

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

	return paginated(
		posts,
		createPaginationMeta({
			page: query.page,
			limit: query.limit,
			total,
		}),
	);
}

async function findById(id: string) {
	const post = await postRepository.findById(id);

	if (!post) {
		throw new NotFoundError("Post not found");
	}

	return data(post);
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

		return data(post);
	} catch (error) {
		translatePrismaError(error, {
			conflict: "A post with this slug already exists.",
		});
	}
}

async function update(id: string, input: UpdatePost) {
	await findById(id);

	try {
		const post = await postRepository.update(id, {
			...input,
		});

		return data(post);
	} catch (error) {
		translatePrismaError(error, {
			conflict: "A post with this slug already exists.",
		});
	}
}

async function deletePost(id: string) {
	await findById(id);

	try {
		return await postRepository.delete(id);
	} catch (error) {
		translatePrismaError(error);
	}
}

export const postService = {
	findMany,
	findById,
	create,
	update,
	delete: deletePost,
};
