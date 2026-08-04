import { describe, expect, it } from "vitest";
import {
	ConflictError,
	NotFoundError,
} from "../../../src/errors/http-errors.js";
import { translatePrismaError } from "../../../src/lib/prisma-error.js";
import {
	recordNotFoundError,
	uniqueConstraintError,
} from "../../helpers/prisma-error.js";

describe("translatePrismaError", () => {
	it("translates unique constraint errors to ConflictError", () => {
		// Act & Assert
		expect(() =>
			translatePrismaError(uniqueConstraintError(), {
				conflict: "Slug already exists",
			}),
		).toThrow(new ConflictError("Slug already exists"));
	});

	it("translates missing record errors to NotFoundError", () => {
		// Act & Assert
		expect(() =>
			translatePrismaError(recordNotFoundError(), {
				notFound: "Post not found",
			}),
		).toThrow(new NotFoundError("Post not found"));
	});

	it("rethrows unknown Prisma errors", () => {
		// Arrange
		const error = new Error("Unexpected");

		// Act & Assert
		expect(() => translatePrismaError(error)).toThrow(error);
	});
});
