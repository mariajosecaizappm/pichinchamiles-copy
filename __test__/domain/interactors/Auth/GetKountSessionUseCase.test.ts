import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    kountCollection: vi.fn(),
}));

vi.mock("@/domain/services/KountService", () => ({
    default: {
        kountCollection: mocks.kountCollection,
    },
}));

import GetKountSessionUseCase from "@/domain/interactors/Auth/GetKountSessionUseCase";

describe("GetKountSessionUseCase", () => {
    it("returns the session id from KountService", () => {
        mocks.kountCollection.mockReturnValueOnce("session-123");
        const useCase = new GetKountSessionUseCase();

        expect(useCase.getSessionId()).toBe("session-123");
        expect(mocks.kountCollection).toHaveBeenCalledTimes(1);
    });
});
