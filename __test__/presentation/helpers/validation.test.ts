import { describe, expect, it } from "vitest"
import {
    phoneInputRegExp,
    validDocument,
    validateOtp,
    validationPhone,
} from "@/presentation/helpers/validation"
import { Otp } from "@/domain/entity/Otp/otp"

describe("validDocument", () => {
    it("should validate CI with Ecuador check digit algorithm", () => {
        expect(validDocument("1713175071", "CI")).toBe(true)
        expect(validDocument("1234567890", "CI")).toBe(false)
        expect(validDocument("123456789", "CI")).toBe(false)
        expect(validDocument("9913175071", "CI")).toBe(false)
    })

    it("should reject CI with non-digit characters", () => {
        expect(validDocument("171317507A", "CI")).toBe(false)
    })

    it("should reject CI with invalid person type digit", () => {
        expect(validDocument("1773175071", "CI")).toBe(false)
    })

    it("should reject CI with invalid province code", () => {
        expect(validDocument("0013175071", "CI")).toBe(false)
        expect(validDocument("2513175071", "CI")).toBe(false)
    })

    it("should validate RUC with Ecuador check digit algorithm", () => {
        expect(validDocument("1713175071001", "RUC")).toBe(true)
        expect(validDocument("1234567890123", "RUC")).toBe(false)
        expect(validDocument("123456789012", "RUC")).toBe(false)
        expect(validDocument("1713175071000", "RUC")).toBe(false)
    })

    it("should reject RUC ending in 000", () => {
        expect(validDocument("1713175070000", "RUC")).toBe(false)
    })

    it("should reject RUC with non-digit characters", () => {
        expect(validDocument("171317507100A", "RUC")).toBe(false)
    })

    it("should reject RUC with invalid person type", () => {
        expect(validDocument("1783175071001", "RUC")).toBe(false)
    })

    it("should validate PPN with alphanumeric format", () => {
        expect(validDocument("AB12", "PPN")).toBe(true)
        expect(validDocument("ABC", "PPN")).toBe(false)
        expect(validDocument("ABCD123456789012", "PPN")).toBe(true)
        expect(validDocument("ABCD1234567890123", "PPN")).toBe(false)
        expect(validDocument("ABCD", "PPN")).toBe(false)
    })

    it("should return false for empty value or unknown type", () => {
        expect(validDocument("", "CI")).toBe(false)
        expect(validDocument("1713175071", "UNKNOWN")).toBe(false)
    })
})

describe("validationPhone", () => {
    it("should match valid Ecuador mobile numbers", () => {
        expect(validationPhone.test("0999999999")).toBe(true)
        expect(validationPhone.test("0899999999")).toBe(false)
        expect(validationPhone.test("099999999")).toBe(false)
    })
})

describe("phoneInputRegExp", () => {
    it("should allow up to 10 digits while typing", () => {
        expect(phoneInputRegExp.test("0999999999")).toBe(true)
        expect(phoneInputRegExp.test("09999999999")).toBe(false)
        expect(phoneInputRegExp.test("abc")).toBe(false)
    })
})

describe("validateOtp", () => {
    it("should return true when cellPhone is present and required fields are set", () => {
        const dataOtp: Otp = {
            cellPhone: "0999999999",
            durationOtpCodeMinutes: 5,
            email: null,
            mfaToken: "mfa-token",
        }

        expect(validateOtp(dataOtp)).toBe(true)
    })

    it("should return true when email is present and required fields are set", () => {
        const dataOtp: Otp = {
            cellPhone: null,
            durationOtpCodeMinutes: 10,
            email: "user@example.com",
            mfaToken: "mfa-token",
        }

        expect(validateOtp(dataOtp)).toBe(true)
    })

    it("should return false when both cellPhone and email are null", () => {
        const dataOtp: Otp = {
            cellPhone: null,
            durationOtpCodeMinutes: 5,
            email: null,
            mfaToken: "mfa-token",
        }

        expect(validateOtp(dataOtp)).toBe(false)
    })

    it("should return false when durationOtpCodeMinutes is zero", () => {
        const dataOtp: Otp = {
            cellPhone: "0999999999",
            durationOtpCodeMinutes: 0,
            email: null,
            mfaToken: "mfa-token",
        }

        expect(validateOtp(dataOtp)).toBe(false)
    })

    it("should return false when mfaToken is empty", () => {
        const dataOtp: Otp = {
            cellPhone: "0999999999",
            durationOtpCodeMinutes: 5,
            email: null,
            mfaToken: "",
        }

        expect(validateOtp(dataOtp)).toBe(false)
    })
})
