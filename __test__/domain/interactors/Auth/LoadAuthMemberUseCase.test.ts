import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"
import {ErrorCode} from "@/domain/entity/Error/structure/error"

const mocks = vi.hoisted(() => {
    const decryptText = vi.fn()
    const getToken = vi.fn()
    const clearToken = vi.fn()
    const getRecaptchaToken = vi.fn()
    const isSkippedLopd = vi.fn()
    const skipLopd = vi.fn()
    const setSessionCookieInBrowser = vi.fn()

    return {
        decryptText,
        getToken,
        clearToken,
        getRecaptchaToken,
        isSkippedLopd,
        skipLopd,
        setSessionCookieInBrowser,
    }
})

vi.mock("@/domain/services/TokenService", () => ({
    default: {
        getToken: mocks.getToken,
        clearToken: mocks.clearToken,
    },
}))

vi.mock("@/domain/services/RecaptchaService", () => ({
    default: {
        getToken: mocks.getRecaptchaToken,
    },
}))

vi.mock("@/domain/services/LopdPreferencesService", () => ({
    default: {
        isSkippedLopd: mocks.isSkippedLopd,
        skipLopd: mocks.skipLopd,
    },
}))

vi.mock("@/domain/entity/Session/sessionCookie", () => ({
    setSessionCookieInBrowser: mocks.setSessionCookieInBrowser,
}))

import LoadAuthMemberUseCase from "@/domain/interactors/Auth/LoadAuthMemberUseCase"

describe("LoadAuthMemberUseCase", () => {
    const mockDateEsEc = () => {
        const original = Date.prototype.toLocaleDateString
        Date.prototype.toLocaleDateString = vi.fn().mockReturnValue("01/01/1990") as any
        return () => {
            Date.prototype.toLocaleDateString = original
        }
    }

    const createUseCase = (overrides?: {
        currencyRepository?: any
        memberRepository?: any
        basketRepository?: any
        apigeeRepository?: any
        authRepository?: any
        encryptionService?: any
    }) => {
        const currencyRepository = overrides?.currencyRepository ?? {
            getProgramCurrency: vi.fn().mockResolvedValue({
                pointsCurrencyId: "points-id",
                coinsCurrencyId: "coins-id",
            }),
        }
        const memberRepository = overrides?.memberRepository ?? {
            getMember: vi.fn().mockResolvedValue({
                enrollmentEmail: "enc-email",
                cellPhone: "enc-phone",
                birthDay: "enc-birthDay",
                identificationNumber: "enc-id",
                acceptLopd: true,
            }),
            getMemberBalance: vi.fn().mockResolvedValue(123),
            updateLopd: vi.fn().mockResolvedValue(undefined),
        }
        const basketRepository = overrides?.basketRepository ?? {
            getBasket: vi.fn().mockResolvedValue({buyerId: "buyer", items: []}),
        }
        const apigeeRepository = overrides?.apigeeRepository ?? {
            getCif: vi.fn().mockResolvedValue("cif-123"),
            getConsent: vi.fn().mockResolvedValue({
                url: "https://example.com/lopd.pdf",
                hasConsent: true,
                acceptedTermsConditions: true,
            }),
            updateConsent: vi.fn().mockResolvedValue(undefined),
        }
        const authRepository = overrides?.authRepository ?? ({} as any)
        const encryptionService = overrides?.encryptionService ?? {
            decryptText: mocks.decryptText,
        }

        return {
            useCase: new LoadAuthMemberUseCase(
                memberRepository as any,
                currencyRepository as any,
                authRepository as any,
                basketRepository as any,
                apigeeRepository as any,
                encryptionService as any,
            ),
            currencyRepository,
            memberRepository,
            basketRepository,
            apigeeRepository,
            authRepository,
            encryptionService,
        }
    }

    beforeEach(() => {
        mocks.decryptText.mockReset()
        mocks.getToken.mockReset()
        mocks.clearToken.mockReset()
        mocks.getRecaptchaToken.mockReset()
        mocks.isSkippedLopd.mockReset()
        mocks.skipLopd.mockReset()
        mocks.setSessionCookieInBrowser.mockReset()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when getAuthMember is called", () => {
        it("should load data and return decrypted member fields with consent when lopd is not skipped", async () => {
            const restoreDate = mockDateEsEc()

            mocks.isSkippedLopd.mockResolvedValueOnce(false)
            mocks.decryptText.mockImplementation((value: string) => {
                if (value === "enc-email") return "juan@example.com"
                if (value === "enc-phone") return "0999999999"
                if (value === "enc-birthDay") return "1990-01-01T12:00:00.000Z"
                if (value === "enc-id") return "1717171717"
                return value
            })

            const {useCase, currencyRepository, memberRepository, basketRepository, apigeeRepository} =
                createUseCase({
                    apigeeRepository: {
                        getCif: vi.fn().mockResolvedValue("cif-123"),
                        getConsent: vi.fn().mockResolvedValue({
                            url: "https://example.com/lopd.pdf",
                            hasConsent: true,
                            acceptedTermsConditions: true,
                        }),
                        updateConsent: vi.fn().mockResolvedValue(undefined),
                    },
                    memberRepository: {
                        getMember: vi.fn().mockResolvedValue({
                            enrollmentEmail: "enc-email",
                            cellPhone: "enc-phone",
                            birthDay: "enc-birthDay",
                            identificationNumber: "enc-id",
                            acceptLopd: true,
                        }),
                        getMemberBalance: vi.fn().mockResolvedValue(123),
                    },
                })

            const result = await useCase.getAuthMember()

            expect(currencyRepository.getProgramCurrency).toHaveBeenCalledTimes(1)
            expect(memberRepository.getMember).toHaveBeenCalledTimes(1)
            expect(memberRepository.getMemberBalance).toHaveBeenCalledWith("points-id")
            expect(basketRepository.getBasket).toHaveBeenCalledTimes(1)
            expect(apigeeRepository.getCif).toHaveBeenCalledTimes(1)
            expect(mocks.isSkippedLopd).toHaveBeenCalledWith("1717171717")
            expect(apigeeRepository.getConsent).toHaveBeenCalledWith("cif-123")

            expect(mocks.decryptText).toHaveBeenCalledWith("enc-email")
            expect(mocks.decryptText).toHaveBeenCalledWith("enc-phone")
            expect(mocks.decryptText).toHaveBeenCalledWith("enc-birthDay")
            expect(mocks.decryptText).toHaveBeenCalledWith("enc-id")

            expect(result).toEqual(
                expect.objectContaining({
                    balance: 123,
                    currency: {
                        pointsCurrencyId: "points-id",
                        coinsCurrencyId: "coins-id",
                    },
                    basket: {buyerId: "buyer", items: []},
                    cif: "cif-123",
                    consent: {
                        url: "https://example.com/lopd.pdf",
                        hasConsent: true,
                        acceptedTermsConditions: true,
                    },
                    member: expect.objectContaining({
                        enrollmentEmail: "juan@example.com",
                        cellPhone: "0999999999",
                        birthDay: "01/01/1990",
                        identificationNumber: "1717171717",
                    }),
                }),
            )

            restoreDate()
        })

        it("should always load consent even when lopd is skipped", async () => {
            const restoreDate = mockDateEsEc()

            mocks.isSkippedLopd.mockResolvedValueOnce(true)
            mocks.decryptText.mockImplementation((value: string) => {
                if (value === "enc-email") return "juan@example.com"
                if (value === "enc-phone") return "0999999999"
                if (value === "enc-birthDay") return "1990-01-01T12:00:00.000Z"
                if (value === "enc-id") return "1717171717"
                return value
            })

            const consent = {
                url: "https://example.com/lopd.pdf",
                hasConsent: true,
                acceptedTermsConditions: true,
            }
            const {useCase, apigeeRepository} = createUseCase({
                apigeeRepository: {
                    getCif: vi.fn().mockResolvedValue("cif-123"),
                    getConsent: vi.fn().mockResolvedValue(consent),
                    updateConsent: vi.fn(),
                },
                memberRepository: {
                    getMember: vi.fn().mockResolvedValue({
                        enrollmentEmail: "enc-email",
                        cellPhone: "enc-phone",
                        birthDay: "enc-birthDay",
                        identificationNumber: "enc-id",
                        acceptLopd: true,
                    }),
                    getMemberBalance: vi.fn().mockResolvedValue(123),
                    updateLopd: vi.fn(),
                },
            })

            const result = await useCase.getAuthMember()

            expect(apigeeRepository.getCif).toHaveBeenCalledTimes(1)
            expect(mocks.isSkippedLopd).toHaveBeenCalledWith("1717171717")
            expect(apigeeRepository.getConsent).toHaveBeenCalledWith("cif-123")
            expect(result.consent).toEqual(consent)

            restoreDate()
        })

        it("should sync member acceptLopd=true via memberRepository when consent hasConsent=true but member.acceptLopd=false", async () => {
            const restoreDate = mockDateEsEc()

            mocks.isSkippedLopd.mockResolvedValueOnce(false)
            mocks.getRecaptchaToken.mockResolvedValueOnce("recaptcha-token")
            mocks.decryptText.mockImplementation((value: string) => {
                if (value === "enc-email") return "juan@example.com"
                if (value === "enc-phone") return "0999999999"
                if (value === "enc-birthDay") return "1990-01-01T12:00:00.000Z"
                if (value === "enc-id") return "1717171717"
                return value
            })

            const updateConsent = vi.fn()
            const updateMemberLopd = vi.fn().mockResolvedValue(undefined)
            const member = {
                enrollmentEmail: "enc-email",
                cellPhone: "enc-phone",
                birthDay: "enc-birthDay",
                identificationNumber: "enc-id",
                acceptLopd: false,
            }
            const consent = {
                url: "https://example.com/lopd.pdf",
                hasConsent: true,
                acceptedTermsConditions: true,
            }
            const {useCase, apigeeRepository, memberRepository} = createUseCase({
                apigeeRepository: {
                    getCif: vi.fn().mockResolvedValue("cif-123"),
                    getConsent: vi.fn().mockResolvedValue(consent),
                    updateConsent,
                },
                memberRepository: {
                    getMember: vi.fn().mockResolvedValue(member),
                    getMemberBalance: vi.fn().mockResolvedValue(123),
                    updateLopd: updateMemberLopd,
                },
            })

            const result = await useCase.getAuthMember()

            expect(mocks.getRecaptchaToken).toHaveBeenCalledWith("UpdateLopd")
            expect(updateMemberLopd).toHaveBeenCalledWith(
                true,
                "web",
                "UpdateLopd",
                "recaptcha-token",
            )
            expect(updateConsent).not.toHaveBeenCalled()
            expect(mocks.skipLopd).not.toHaveBeenCalled()
            expect(result.member.acceptLopd).toBe(true)
            expect(result.consent).toEqual(consent)

            restoreDate()
        })

        it("should not sync when consent hasConsent=false and member.acceptLopd differs", async () => {
            const restoreDate = mockDateEsEc()

            mocks.isSkippedLopd.mockResolvedValueOnce(false)
            mocks.decryptText.mockImplementation((value: string) => {
                if (value === "enc-birthDay") return "1990-01-01T12:00:00.000Z"
                if (value === "enc-id") return "1717171717"
                return value
            })

            const updateConsent = vi.fn()
            const updateMemberLopd = vi.fn()
            const {useCase, apigeeRepository} = createUseCase({
                apigeeRepository: {
                    getCif: vi.fn().mockResolvedValue("cif-123"),
                    getConsent: vi.fn().mockResolvedValue({
                        url: "https://example.com/lopd.pdf",
                        hasConsent: false,
                        acceptedTermsConditions: false,
                    }),
                    updateConsent,
                },
                memberRepository: {
                    getMember: vi.fn().mockResolvedValue({
                        enrollmentEmail: "enc-email",
                        cellPhone: "enc-phone",
                        birthDay: "enc-birthDay",
                        identificationNumber: "enc-id",
                        acceptLopd: true,
                    }),
                    getMemberBalance: vi.fn().mockResolvedValue(123),
                    updateLopd: updateMemberLopd,
                },
            })

            const result = await useCase.getAuthMember()

            expect(apigeeRepository.getConsent).toHaveBeenCalledWith("cif-123")
            expect(updateConsent).not.toHaveBeenCalled()
            expect(updateMemberLopd).not.toHaveBeenCalled()
            expect(mocks.skipLopd).not.toHaveBeenCalled()
            expect(result.consent).toEqual({
                url: "https://example.com/lopd.pdf",
                hasConsent: false,
                acceptedTermsConditions: false,
            })

            restoreDate()
        })

        it("should not sync when consent hasConsent is null", async () => {
            const restoreDate = mockDateEsEc()

            mocks.isSkippedLopd.mockResolvedValueOnce(false)
            mocks.decryptText.mockImplementation((value: string) => {
                if (value === "enc-birthDay") return "1990-01-01T12:00:00.000Z"
                if (value === "enc-id") return "1717171717"
                return value
            })

            const updateMemberLopd = vi.fn()
            const {useCase} = createUseCase({
                apigeeRepository: {
                    getCif: vi.fn().mockResolvedValue("cif-123"),
                    getConsent: vi.fn().mockResolvedValue({
                        url: "https://example.com/lopd.pdf",
                        hasConsent: null,
                        acceptedTermsConditions: false,
                    }),
                    updateConsent: vi.fn(),
                },
                memberRepository: {
                    getMember: vi.fn().mockResolvedValue({
                        enrollmentEmail: "enc-email",
                        cellPhone: "enc-phone",
                        birthDay: "enc-birthDay",
                        identificationNumber: "enc-id",
                        acceptLopd: false,
                    }),
                    getMemberBalance: vi.fn().mockResolvedValue(123),
                    updateLopd: updateMemberLopd,
                },
            })

            await useCase.getAuthMember()

            expect(updateMemberLopd).not.toHaveBeenCalled()
            expect(mocks.getRecaptchaToken).not.toHaveBeenCalled()

            restoreDate()
        })

        it("should not update anything when member acceptLopd equals consent hasConsent", async () => {
            const restoreDate = mockDateEsEc()

            mocks.isSkippedLopd.mockResolvedValueOnce(false)
            mocks.decryptText.mockImplementation((value: string) => {
                if (value === "enc-birthDay") return "1990-01-01T12:00:00.000Z"
                if (value === "enc-id") return "1717171717"
                return value
            })

            const updateConsent = vi.fn().mockResolvedValue(undefined)
            const updateMemberLopd = vi.fn()
            const {useCase, apigeeRepository} = createUseCase({
                apigeeRepository: {
                    getCif: vi.fn().mockResolvedValue("cif-123"),
                    getConsent: vi.fn().mockResolvedValue({
                        url: "https://example.com/lopd.pdf",
                        hasConsent: false,
                        acceptedTermsConditions: false,
                    }),
                    updateConsent,
                },
                memberRepository: {
                    getMember: vi.fn().mockResolvedValue({
                        enrollmentEmail: "enc-email",
                        cellPhone: "enc-phone",
                        birthDay: "enc-birthDay",
                        identificationNumber: "enc-id",
                        acceptLopd: false,
                    }),
                    getMemberBalance: vi.fn().mockResolvedValue(123),
                    updateLopd: updateMemberLopd,
                },
            })

            const result = await useCase.getAuthMember()

            expect(apigeeRepository.getConsent).toHaveBeenCalledWith("cif-123")
            expect(updateConsent).not.toHaveBeenCalled()
            expect(updateMemberLopd).not.toHaveBeenCalled()
            expect(mocks.skipLopd).not.toHaveBeenCalled()
            expect(result.consent).toEqual({
                url: "https://example.com/lopd.pdf",
                hasConsent: false,
                acceptedTermsConditions: false,
            })

            restoreDate()
        })
    })

    describe("when loadAuthMember is called", () => {
        it("should return auth member when token exists", async () => {
            const token = {
                accessToken: "access",
                refreshToken: "refresh",
                refreshTokenExpireDate: new Date("2030-01-01T00:00:00.000Z"),
            }
            mocks.getToken.mockResolvedValueOnce(token)

            const useCase = new LoadAuthMemberUseCase(
                {} as any,
                {} as any,
                {isValidCookie: vi.fn()} as any,
                {} as any,
                {} as any,
                {} as any,
            )

            const authMember = {member: {}, balance: 0, currency: {}, basket: null} as any
            const spy = vi
                .spyOn(useCase, "getAuthMember")
                .mockResolvedValueOnce(authMember)

            const result = await useCase.loadAuthMember()

            expect(spy).toHaveBeenCalledTimes(1)
            expect(mocks.getRecaptchaToken).not.toHaveBeenCalled()
            expect(result).toBe(authMember)
        })

        it("should validate cookie and return auth member when token is missing and cookie is valid", async () => {
            mocks.getToken.mockResolvedValueOnce(null)
            mocks.getRecaptchaToken.mockResolvedValueOnce("recaptcha-token")

            const authRepository = {
                isValidCookie: vi.fn().mockResolvedValue(true),
            }

            const useCase = new LoadAuthMemberUseCase(
                {} as any,
                {} as any,
                authRepository as any,
                {} as any,
                {} as any,
                {} as any,
            )

            const authMember = {member: {}, balance: 0, currency: {}, basket: null} as any
            const spy = vi
                .spyOn(useCase, "getAuthMember")
                .mockResolvedValueOnce(authMember)

            const result = await useCase.loadAuthMember()

            expect(mocks.getRecaptchaToken).toHaveBeenCalledWith("validateSession")
            expect(authRepository.isValidCookie).toHaveBeenCalledWith(
                "recaptcha-token",
                "validateSession",
            )
            expect(spy).toHaveBeenCalledTimes(1)
            expect(result).toBe(authMember)
        })

        it("should throw ApiError when isValidCookie API call throws an error", async () => {
            mocks.getToken.mockResolvedValueOnce(null)
            mocks.getRecaptchaToken.mockResolvedValueOnce("recaptcha-token")

            const authRepository = {
                isValidCookie: vi.fn().mockRejectedValue(new Error("API Error")),
            }

            const useCase = new LoadAuthMemberUseCase(
                {} as any,
                {} as any,
                authRepository as any,
                {} as any,
                {} as any,
            )

            await expect(useCase.loadAuthMember()).rejects.toMatchObject({
                code: ErrorCode.UNKNOWN,
            })
        })

        it("should throw ApiError when there is no token and cookie is invalid (isValidCookie returns false)", async () => {
            mocks.getToken.mockResolvedValueOnce(null)
            mocks.getRecaptchaToken.mockResolvedValueOnce("recaptcha-token")

            const authRepository = {
                isValidCookie: vi.fn().mockResolvedValue(false),
            }

            const useCase = new LoadAuthMemberUseCase(
                {} as any,
                {} as any,
                authRepository as any,
                {} as any,
                {} as any,
                {} as any,
            )

            await expect(useCase.loadAuthMember()).rejects.toMatchObject({
                code: ErrorCode.UNKNOWN,
            })
        })

        it("should clear token and rethrow when getAuthMember fails", async () => {
            const token = {
                accessToken: "access",
                refreshToken: "refresh",
                refreshTokenExpireDate: new Date("2030-01-01T00:00:00.000Z"),
            }
            mocks.getToken.mockResolvedValueOnce(token)
            mocks.clearToken.mockResolvedValueOnce(undefined)

            const useCase = new LoadAuthMemberUseCase(
                {} as any,
                {} as any,
                {isValidCookie: vi.fn()} as any,
                {} as any,
                {} as any,
                {} as any,
            )

            vi.spyOn(useCase, "getAuthMember").mockRejectedValueOnce(new Error("boom"))

            await expect(useCase.loadAuthMember()).rejects.toThrow("boom")
            expect(mocks.clearToken).toHaveBeenCalledTimes(1)
        })
    })

    describe("session cookie handling in getAuthMember", () => {
        it("should encrypt identification and set session cookie when encryptionService.encryptText is present", async () => {
            const restoreDate = mockDateEsEc()
            const encryptTextMock = vi.fn().mockResolvedValue("encrypted-id-cookie-val")
            mocks.decryptText.mockResolvedValue("decrypted-id-17")

            const { useCase } = createUseCase({
                encryptionService: {
                    decryptText: mocks.decryptText,
                    encryptText: encryptTextMock,
                },
            })

            const result = await useCase.getAuthMember()

            expect(encryptTextMock).toHaveBeenCalledWith("decrypted-id-17")
            expect(mocks.setSessionCookieInBrowser).toHaveBeenCalledWith("encrypted-id-cookie-val")
            expect(result.member.identificationNumber).toBe("decrypted-id-17")
            restoreDate()
        })

        it("should safely ignore errors if encryptText throws and still return result", async () => {
            const restoreDate = mockDateEsEc()
            const encryptTextMock = vi.fn().mockRejectedValue(new Error("encryption failed"))
            mocks.decryptText.mockResolvedValue("decrypted-id-17")

            const { useCase } = createUseCase({
                encryptionService: {
                    decryptText: mocks.decryptText,
                    encryptText: encryptTextMock,
                },
            })

            const result = await useCase.getAuthMember()

            expect(encryptTextMock).toHaveBeenCalledWith("decrypted-id-17")
            expect(result.member.identificationNumber).toBe("decrypted-id-17")
            restoreDate()
        })

        it("should safely ignore errors if setSessionCookieInBrowser throws and still return result", async () => {
            const restoreDate = mockDateEsEc()
            const encryptTextMock = vi.fn().mockResolvedValue("encrypted-id-val")
            mocks.setSessionCookieInBrowser.mockImplementation(() => {
                throw new Error("Cannot set cookie in restricted context")
            })
            mocks.decryptText.mockResolvedValue("decrypted-id-17")

            const { useCase } = createUseCase({
                encryptionService: {
                    decryptText: mocks.decryptText,
                    encryptText: encryptTextMock,
                },
            })

            const result = await useCase.getAuthMember()

            expect(result.member.identificationNumber).toBe("decrypted-id-17")
            restoreDate()
        })
    })
})
