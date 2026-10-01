import {describe, expect, it} from "vitest"
import {consentAdapter} from "@/data/adapters/Member/apigeeAdapter"

describe("apigeeAdapter", () => {
    describe("when consentAdapter receives a consent payload", () => {
        it("should map hasConsent, acceptedTermsConditions and url fields", () => {
            const apiPayload = {
                hasConsent: true,
                acceptedTermsConditions: false,
                url: "https://example.com/lopd",
                extra: "ignored",
            }

            const result = consentAdapter(apiPayload as any)

            expect(result).toEqual({
                hasConsent: true,
                acceptedTermsConditions: false,
                url: "https://example.com/lopd",
            })
        })
    })
})
