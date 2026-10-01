import {describe, it, expect, vi, beforeEach, afterEach} from "vitest"

const mocks = vi.hoisted(() => {
    const encrypt = vi.fn()
    const decrypt = vi.fn()
    const wordArrayCreate = vi.fn()
    const CBC = {id: "CBC"}
    const Pkcs7 = {id: "Pkcs7"}
    const Utf8 = {id: "Utf8"}
    return {encrypt, decrypt, wordArrayCreate, CBC, Pkcs7, Utf8}
})

vi.mock("crypto-js", () => ({
    default: {
        AES: {
            encrypt: mocks.encrypt,
            decrypt: mocks.decrypt,
        },
        lib: {
            WordArray: {
                create: mocks.wordArrayCreate,
            },
        },
        mode: {
            CBC: mocks.CBC,
        },
        pad: {
            Pkcs7: mocks.Pkcs7,
        },
        enc: {
            Utf8: mocks.Utf8,
        },
    },
}))

const importActionsWithEnv = async (aesKey: string | undefined) => {
    vi.resetModules()

    const originalEnv = process.env
    process.env = {...originalEnv}
    if (aesKey === undefined) {
        delete process.env.AES_KEY
        delete process.env.NEXT_PUBLIC_AES_KEY
    } else {
        process.env.AES_KEY = aesKey
    }

    const actions = await import("@/data/provider/crypto/actions")

    process.env = originalEnv
    return actions
}

describe("Crypto actions", () => {
    beforeEach(() => {
        mocks.encrypt.mockReset()
        mocks.decrypt.mockReset()
        mocks.wordArrayCreate.mockReset()
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    describe("when encryptText is called", () => {
        it("should encrypt using AES-CBC and return cipher text", async () => {
            const encryptionResult = {toString: vi.fn(() => "cipher-123")}

            mocks.wordArrayCreate.mockImplementation((words: number[], len: number) => ({
                words,
                sigBytes: len,
            }))
            mocks.encrypt.mockReturnValueOnce(encryptionResult)

            const actions = await importActionsWithEnv("a")
            const result = await actions.encryptText("plain")

            expect(result).toBe("cipher-123")
            expect(mocks.encrypt).toHaveBeenCalledTimes(1)

            const [plainTextArg, keyArg, optionsArg] =
                mocks.encrypt.mock.calls[0] ?? []

            expect(plainTextArg).toBe("plain")
            expect(optionsArg.mode).toBe(mocks.CBC)
            expect(optionsArg.padding).toBe(mocks.Pkcs7)

            expect(mocks.wordArrayCreate).toHaveBeenCalledTimes(2)

            const [keyWords, keyLen] = mocks.wordArrayCreate.mock.calls[0] ?? []
            expect(keyLen).toBe(32)
            expect(keyWords[0]).toBe(97 << 24)

            const [ivWords, ivLen] = mocks.wordArrayCreate.mock.calls[1] ?? []
            expect(ivLen).toBe(16)
            expect(ivWords[0]).toBe((1 << 24) | (2 << 16) | (3 << 8) | 4)
            expect(ivWords[1]).toBe((5 << 24) | (6 << 16) | (6 << 8) | 5)

            expect(keyArg).toMatchObject({sigBytes: 32})
            expect(optionsArg.iv).toMatchObject({sigBytes: 16})
        })
    })

    describe("when decryptText is called", () => {
        it("should decrypt using AES-CBC and return plain text", async () => {
            const toString = vi.fn(() => "plain")
            const decryptResult = {toString}

            mocks.wordArrayCreate.mockImplementation((words: number[], len: number) => ({
                words,
                sigBytes: len,
            }))
            mocks.decrypt.mockReturnValueOnce(decryptResult)

            const actions = await importActionsWithEnv("a")
            const result = await actions.decryptText("cipher-123")

            expect(result).toBe("plain")
            expect(mocks.decrypt).toHaveBeenCalledTimes(1)

            const [cipherTextArg, keyArg, optionsArg] =
                mocks.decrypt.mock.calls[0] ?? []

            expect(cipherTextArg).toBe("cipher-123")
            expect(optionsArg.mode).toBe(mocks.CBC)
            expect(optionsArg.padding).toBe(mocks.Pkcs7)
            expect(keyArg).toMatchObject({sigBytes: 32})
            expect(optionsArg.iv).toMatchObject({sigBytes: 16})
            expect(toString).toHaveBeenCalledWith(mocks.Utf8)
        })
    })

    describe("when AES_KEY is not set", () => {
        it("should still build a 32-byte key and encrypt", async () => {
            const encryptionResult = {toString: vi.fn(() => "cipher-xyz")}

            mocks.wordArrayCreate.mockImplementation((words: number[], len: number) => ({
                words,
                sigBytes: len,
            }))
            mocks.encrypt.mockReturnValueOnce(encryptionResult)

            const actions = await importActionsWithEnv(undefined)
            const result = await actions.encryptText("plain")

            expect(result).toBe("cipher-xyz")

            const [keyWords, keyLen] = mocks.wordArrayCreate.mock.calls[0] ?? []
            expect(keyLen).toBe(32)
            expect(keyWords[0]).toBe(0)
        })
    })
})
