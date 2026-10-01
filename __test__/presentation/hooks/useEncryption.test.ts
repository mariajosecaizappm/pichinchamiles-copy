import { describe, expect, it, vi, beforeEach } from "vitest"
import { renderHook } from "@testing-library/react"
import useEncryption from "@/presentation/hooks/useEncryption"

const mocks = vi.hoisted(() => ({
    encryptText: vi.fn(),
    containerGet: vi.fn(),
}))

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: mocks.containerGet,
    },
}))

describe("useEncryption", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mocks.containerGet.mockReturnValue({
            encryptText: mocks.encryptText,
        })
    })

    it("obtains EncryptTextUseCase from the container when encryptText is called", async () => {
        const { result } = renderHook(() => useEncryption())

        await result.current.encryptText("1717171717")

        expect(mocks.containerGet).toHaveBeenCalledTimes(1)
    })

    it("delegates encryptText calls to the use case", async () => {
        mocks.encryptText.mockResolvedValue("encrypted-identification")

        const { result } = renderHook(() => useEncryption())

        await expect(result.current.encryptText("1717171717")).resolves.toBe("encrypted-identification")
        expect(mocks.encryptText).toHaveBeenCalledWith("1717171717")
    })
})
