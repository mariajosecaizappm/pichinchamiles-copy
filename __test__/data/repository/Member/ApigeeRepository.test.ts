import {afterEach, beforeEach, describe, expect, it, vi} from "vitest"

const mocks = vi.hoisted(() => {
    const consentAdapter = vi.fn()
    const getCifAdapter = vi.fn()
    const axGet = vi.fn()
    const axPost = vi.fn()
    const getToken = vi.fn()

    return {consentAdapter, getCifAdapter, axGet, axPost, getToken}
})

vi.mock("@/presentation/config/inversify.config", () => ({
    default: {
        get: vi.fn(),
        bind: vi.fn().mockReturnThis(),
        to: vi.fn(),
    },
}))

vi.mock("@/data/adapters/Member/apigeeAdapter", () => ({
    consentAdapter: mocks.consentAdapter,
    getCifAdapter: mocks.getCifAdapter,
}))

vi.mock("@/data/provider/axios/axiosPrivate", () => ({
    default: {
        get: mocks.axGet,
        post: mocks.axPost,
    },
}))

vi.mock("@/domain/services/TokenService", () => ({
    default: {
        getToken: mocks.getToken,
    },
}))

describe("ApigeeRepository", () => {
    beforeEach(() => {
        mocks.consentAdapter.mockReset()
        mocks.axGet.mockReset()
        mocks.axPost.mockReset()
        mocks.getToken.mockReset()
        process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000"
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when getCif is called", () => {
        it("should return clientIdentifierField from response", async () => {
            vi.resetModules()
            mocks.getToken.mockResolvedValue({accessToken: "valid-token"})
            mocks.axGet.mockResolvedValueOnce({
                data: {clientIdentifierField: "test-cif"},
            })
            mocks.getCifAdapter.mockReturnValueOnce("test-cif")

            const {default: ApigeeRepository} = await import("@/data/repository/Member/ApigeeRepository")
            const repository = new ApigeeRepository()

            const result = await repository.getCif()

            expect(mocks.axGet).toHaveBeenCalledWith("/identity-api/users/members/cif")
            expect(mocks.getCifAdapter).toHaveBeenCalledWith({clientIdentifierField: "test-cif"})
            expect(result).toBe("test-cif")
        })

        it("should return null when API fails", async () => {
            vi.resetModules()
            mocks.getToken.mockResolvedValue({accessToken: "valid-token"})
            mocks.axGet.mockRejectedValueOnce(new Error("network error"))

            const {default: ApigeeRepository} = await import("@/data/repository/Member/ApigeeRepository")
            const repository = new ApigeeRepository()

            const result = await repository.getCif()
            expect(result).toBeNull()
        })

        it("should return null when there is no token", async () => {
            vi.resetModules()
            mocks.getToken.mockResolvedValue(null)
            mocks.axGet.mockRejectedValueOnce(new Error("no token"))

            const {default: ApigeeRepository} = await import("@/data/repository/Member/ApigeeRepository")
            const repository = new ApigeeRepository()

            const result = await repository.getCif()

            expect(result).toBeNull()
        })
    })

    describe("when getConsent is called", () => {
        it("should request consent and adapt response", async () => {
            vi.resetModules()
            const cif = "cif-123"
            const apiConsent = {
                hasConsent: null,
                acceptedTermsConditions: true,
                url: "https://example.com/lopd",
            }
            const adaptedConsent = {
                hasConsent: false,
                acceptedTermsConditions: false,
                url: "adapted-url",
            }

            mocks.axGet.mockResolvedValueOnce({data: apiConsent})
            mocks.consentAdapter.mockReturnValueOnce(adaptedConsent)

            const {default: ApigeeRepository} = await import("@/data/repository/Member/ApigeeRepository")
            const repository = new ApigeeRepository()

            const result = await repository.getConsent(cif)

            expect(mocks.axGet).toHaveBeenCalledWith(
                `/identity-api/users/members/consent/lopd?clientIdentifierField=${cif}`,
            )
            expect(mocks.consentAdapter).toHaveBeenCalledWith(apiConsent)
            expect(result).toBe(adaptedConsent)
        })

        it("should return null when API fails", async () => {
            vi.resetModules()
            const cif = "cif-123"

            mocks.axGet.mockRejectedValueOnce(new Error("network error"))

            const {default: ApigeeRepository} = await import("@/data/repository/Member/ApigeeRepository")
            const repository = new ApigeeRepository()

            const result = await repository.getConsent(cif)
            expect(result).toBeNull()
        })
    })

    describe("when updateConsent is called", () => {
        it("should post consent register payload", async () => {
            vi.resetModules()
            const payload = {
                cif: "cif-123",
                action: "ACCEPT",
                hasConsent: true,
                acceptedTermsConditions: true,
                url: "https://example.com/lopd",
            }

            mocks.axPost.mockResolvedValueOnce({data: {}})

            const {default: ApigeeRepository} = await import("@/data/repository/Member/ApigeeRepository")
            const repository = new ApigeeRepository()

            await expect(repository.updateConsent(payload as any)).resolves.toBeUndefined()

            expect(mocks.axPost).toHaveBeenCalledWith(
                "/identity-api/users/members/consent/lopd",
                payload,
            )
        })

        it("should resolve without throwing when API fails", async () => {
            vi.resetModules()
            const payload = {
                cif: "cif-123",
                action: "ACCEPT",
                hasConsent: true,
                acceptedTermsConditions: true,
                url: "https://example.com/lopd",
            }

            mocks.axPost.mockRejectedValueOnce(new Error("network error"))

            const {default: ApigeeRepository} = await import("@/data/repository/Member/ApigeeRepository")
            const repository = new ApigeeRepository()

            await expect(repository.updateConsent(payload as any)).resolves.toBeUndefined()
        })
    })
})
