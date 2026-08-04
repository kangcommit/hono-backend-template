import { describe, expect, it } from "vitest";
import { isAdmin } from "../../../src/auth/roles.js";
import { user } from "../../helpers/fixtures/auth.js";

describe("isAdmin", () => {
	it("returns true when the user has the admin role", () => {
		// Act
		const result = isAdmin({
			...user,
			role: "user, admin",
		});

		// Assert
		expect(result).toBe(true);
	});

	it("returns false when the user does not have the admin role", () => {
		// Act
		const result = isAdmin({
			...user,
			role: "user",
		});

		// Assert
		expect(result).toBe(false);
	});

	it("returns false when the user has no roles", () => {
		// Act
		const result = isAdmin({
			...user,
			role: null,
		});

		// Assert
		expect(result).toBe(false);
	});
});
