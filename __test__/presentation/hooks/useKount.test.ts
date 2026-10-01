import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useKount from "@/presentation/hooks/useKount";

const mocks = vi.hoisted(() => ({
    containerGet: vi.fn(),
    getSessionId: vi.fn(),
}));

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}));

describe("useKount", () => {
    beforeEach(() => {
        mocks.containerGet.mockReset();
        mocks.getSessionId.mockReset();
        mocks.containerGet.mockReturnValue({ getSessionId: mocks.getSessionId });
    });

    it("loads the kount session id on mount", async () => {
        mocks.getSessionId.mockReturnValueOnce("session-123");

        const { result } = renderHook(() => useKount());

        await waitFor(() => {
            expect(result.current.sessionId).toBe("session-123");
        });
        expect(mocks.containerGet).toHaveBeenCalled();
        expect(mocks.getSessionId).toHaveBeenCalled();
    });
});
