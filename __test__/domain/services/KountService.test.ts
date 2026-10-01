import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    kountSdk: vi.fn(),
}));

vi.mock("@kount/kount-web-client-sdk", () => ({
    default: mocks.kountSdk,
}));

describe("KountService", () => {
    const originalEnv = {
        clientId: process.env.NEXT_PUBLIC_KOUNT_CLIENT_ID,
        hostname: process.env.NEXT_PUBLIC_KOUNT_HOSTNAME,
        environment: process.env.NEXT_PUBLIC_KOUNT_ENVIRONMENT,
    };

    beforeEach(() => {
        mocks.kountSdk.mockReset();
        vi.resetModules();
    });

    afterEach(() => {
        process.env.NEXT_PUBLIC_KOUNT_CLIENT_ID = originalEnv.clientId;
        process.env.NEXT_PUBLIC_KOUNT_HOSTNAME = originalEnv.hostname;
        process.env.NEXT_PUBLIC_KOUNT_ENVIRONMENT = originalEnv.environment;
    });

    it("returns a session id without dashes and initializes the sdk", async () => {
        process.env.NEXT_PUBLIC_KOUNT_CLIENT_ID = "client-1";
        process.env.NEXT_PUBLIC_KOUNT_HOSTNAME = "host.test";
        process.env.NEXT_PUBLIC_KOUNT_ENVIRONMENT = "TEST";
        mocks.kountSdk.mockReturnValueOnce({});
        const randomUuidSpy = vi
            .spyOn(globalThis.crypto, "randomUUID")
            .mockReturnValue("1234-5678-90ab-cdef");

        const { default: KountService } = await import("@/domain/services/KountService");
        const sessionId = KountService.kountCollection();

        expect(sessionId).toBe("1234567890abcdef");
        expect(mocks.kountSdk).toHaveBeenCalledWith(
            {
                clientID: "client-1",
                hostname: "host.test",
                environment: "TEST",
                isSinglePageApp: false,
            },
            "1234567890abcdef"
        );

        randomUuidSpy.mockRestore();
    });

    it("throws when config is missing", async () => {
        process.env.NEXT_PUBLIC_KOUNT_CLIENT_ID = "";
        process.env.NEXT_PUBLIC_KOUNT_HOSTNAME = "";
        process.env.NEXT_PUBLIC_KOUNT_ENVIRONMENT = "";

        const { default: KountService } = await import("@/domain/services/KountService");

        expect(() => KountService.kountCollection()).toThrow("Config not found");
        expect(mocks.kountSdk).not.toHaveBeenCalled();
    });

    it("throws when sdk reports an error", async () => {
        process.env.NEXT_PUBLIC_KOUNT_CLIENT_ID = "client-1";
        process.env.NEXT_PUBLIC_KOUNT_HOSTNAME = "host.test";
        process.env.NEXT_PUBLIC_KOUNT_ENVIRONMENT = "TEST";
        mocks.kountSdk.mockReturnValueOnce({ error: ["network"] });
        const randomUuidSpy = vi
            .spyOn(globalThis.crypto, "randomUUID")
            .mockReturnValue("1234-5678-90ab-cdef");

        const { default: KountService } = await import("@/domain/services/KountService");

        expect(() => KountService.kountCollection()).toThrow(
            "Kount conection failed: network"
        );

        randomUuidSpy.mockRestore();
    });
});
