import { describe, expect, it, vi } from "vitest";
import {
	ForbiddenError,
	UnauthorizedError,
} from "../../../src/errors/http-errors.js";
import { auth } from "../../../src/lib/auth.js";
import { requirePermission } from "../../../src/middleware/require-permission.js";
import { user } from "../../helpers/fixtures/auth.js";
import { createMiddlewareContext } from "../../helpers/middleware-context.js";

vi.mock("../../../src/lib/auth.js", () => ({
	auth: {
		api: {
			userHasPermission: vi.fn(),
		},
	},
}));

describe("requirePermission", () => {
	const permissions = {
		post: ["create"],
	} as const;

	it("calls next when the user has permission", async () => {
		// Arrange
		vi.mocked(auth.api.userHasPermission).mockResolvedValue({
			success: true,
			error: null,
		});

		const { c, next } = createMiddlewareContext({
			user,
		});

		// Act
		await requirePermission(permissions)(c as never, next);

		// Assert
		expect(auth.api.userHasPermission).toHaveBeenCalledWith({
			body: {
				userId: user.id,
				permissions,
			},
		});
		expect(next).toHaveBeenCalledOnce();
	});

	it("throws UnauthorizedError when there is no user", async () => {
		// Arrange
		const { c, next } = createMiddlewareContext({
			user: null,
		});

		// Act & Assert
		await expect(
			requirePermission(permissions)(c as never, next),
		).rejects.toThrow(UnauthorizedError);
		expect(auth.api.userHasPermission).not.toHaveBeenCalled();
		expect(next).not.toHaveBeenCalled();
	});

	it("throws ForbiddenError when permission is denied", async () => {
		// Arrange
		vi.mocked(auth.api.userHasPermission).mockResolvedValue({
			success: false,
			error: null,
		});

		const { c, next } = createMiddlewareContext({
			user,
		});

		// Act & Assert
		await expect(
			requirePermission(permissions)(c as never, next),
		).rejects.toThrow(ForbiddenError);
		expect(next).not.toHaveBeenCalled();
	});
});
