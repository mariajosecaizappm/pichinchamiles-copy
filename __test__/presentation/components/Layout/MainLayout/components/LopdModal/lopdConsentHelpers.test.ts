import { describe, expect, it } from "vitest"
import {
    defaultLopdConsentFormValues,
    getLopdConsentModalMessage,
    LOPD_ONLY_CONSENT_MODAL_MESSAGE,
    TERMS_AND_LOPD_CONSENT_MODAL_MESSAGE,
    TERMS_ONLY_CONSENT_MODAL_MESSAGE,
    needsAnyConsent,
    needsLopdConsent,
    needsTermsConsent,
    shouldSyncAcceptLopd,
} from "@/presentation/components/Layout/MainLayout/components/LopdModal/lopdConsentHelpers"

const baseMember = {
    acceptedTermsAndCondition: false,
    acceptLopd: false,
}
const testCif = "cif-123"

describe("lopdConsentHelpers", () => {
    it("should expose default form values", () => {
        expect(defaultLopdConsentFormValues).toEqual({
            acceptedTermsAndCondition: false,
            acceptedLopd: false,
        })
    })

    it("should expose modal messages", () => {
        expect(LOPD_ONLY_CONSENT_MODAL_MESSAGE).toBe(
            "Al autorizar el Tratamiento de tus datos personales, podrás recibir ofertas personalizadas y beneficios exclusivos."
        )
        expect(TERMS_AND_LOPD_CONSENT_MODAL_MESSAGE).toBe(
            "Al aceptar los Términos y Condiciones y autorizar el Tratamiento de tus datos personales, podrás recibir ofertas personalizadas y beneficios exclusivos."
        )
        expect(TERMS_ONLY_CONSENT_MODAL_MESSAGE).toBe(
            "Acepta los Términos y Condiciones del programa para continuar."
        )
    })

    describe("getLopdConsentModalMessage", () => {
        it("should return LOPD-only message when only LOPD consent is pending", () => {
            expect(getLopdConsentModalMessage({ withTerms: false, withLopd: true })).toBe(
                LOPD_ONLY_CONSENT_MODAL_MESSAGE
            )
        })

        it("should return combined message when both consents are pending", () => {
            expect(getLopdConsentModalMessage({ withTerms: true, withLopd: true })).toBe(
                TERMS_AND_LOPD_CONSENT_MODAL_MESSAGE
            )
        })

        it("should return terms-only message when only terms consent is pending", () => {
            expect(getLopdConsentModalMessage({ withTerms: true, withLopd: false })).toBe(
                TERMS_ONLY_CONSENT_MODAL_MESSAGE
            )
        })
    })

    describe("needsTermsConsent", () => {
        it("should return true when member has not accepted terms", () => {
            expect(needsTermsConsent(baseMember as any)).toBe(true)
        })

        it("should return false when member has accepted terms", () => {
            expect(
                needsTermsConsent({ ...baseMember, acceptedTermsAndCondition: true } as any)
            ).toBe(false)
        })

        it("should return false when member is null", () => {
            expect(needsTermsConsent(null)).toBe(false)
        })
    })

    describe("needsLopdConsent", () => {
        it("should return false when member is null", () => {
            expect(needsLopdConsent(null, null, testCif)).toBe(false)
        })

        it("should return true when member has not accepted lopd and consent/cif are missing", () => {
            expect(needsLopdConsent(baseMember as any, null, "")).toBe(true)
            expect(needsLopdConsent(baseMember as any, null, testCif)).toBe(true)
            expect(needsLopdConsent(baseMember as any, { hasConsent: true } as any, "")).toBe(true)
        })

        it("should return false when member has accepted lopd and consent/cif are missing", () => {
            expect(
                needsLopdConsent({ ...baseMember, acceptLopd: true } as any, null, testCif)
            ).toBe(false)
        })

        it("should return true when consent has not been granted (hasConsent=false) with valid cif", () => {
            expect(
                needsLopdConsent(
                    { ...baseMember, acceptLopd: true } as any,
                    { hasConsent: false } as any,
                    testCif
                )
            ).toBe(true)
        })

        it("should return true when consent has not been granted and member has not accepted lopd", () => {
            expect(
                needsLopdConsent(
                    { ...baseMember, acceptLopd: false } as any,
                    { hasConsent: false } as any,
                    testCif
                )
            ).toBe(true)
        })

        it("should return false when consent hasConsent is true even if member acceptLopd is false (with valid cif/consent)", () => {
            expect(
                needsLopdConsent(
                    { ...baseMember, acceptLopd: false } as any,
                    { hasConsent: true } as any,
                    testCif
                )
            ).toBe(false)
        })

        it("should return false when lopd and consent are accepted", () => {
            expect(
                needsLopdConsent(
                    { ...baseMember, acceptLopd: true } as any,
                    { hasConsent: true } as any,
                    testCif
                )
            ).toBe(false)
        })

        it("should return false when consent hasConsent is null and member.acceptLopd is true (with valid cif/consent)", () => {
            expect(
                needsLopdConsent(
                    { ...baseMember, acceptLopd: true } as any,
                    { hasConsent: null } as any,
                    testCif
                )
            ).toBe(false)
        })
    })

    describe("shouldSyncAcceptLopd", () => {
        it("should return false when member is null", () => {
            expect(shouldSyncAcceptLopd(null, { hasConsent: true } as any, testCif)).toBe(false)
        })

        it("should return false when cif is empty", () => {
            expect(
                shouldSyncAcceptLopd(baseMember as any, { hasConsent: true } as any, "")
            ).toBe(false)
        })

        it("should return false when consent is null", () => {
            expect(shouldSyncAcceptLopd(baseMember as any, null, testCif)).toBe(false)
        })

        it("should return true when consent hasConsent=true and member.acceptLopd=false", () => {
            expect(
                shouldSyncAcceptLopd(
                    { ...baseMember, acceptLopd: false } as any,
                    { hasConsent: true } as any,
                    testCif
                )
            ).toBe(true)
        })

        it("should return false when consent hasConsent=true and member.acceptLopd=true", () => {
            expect(
                shouldSyncAcceptLopd(
                    { ...baseMember, acceptLopd: true } as any,
                    { hasConsent: true } as any,
                    testCif
                )
            ).toBe(false)
        })

        it("should return false when consent hasConsent=false and member.acceptLopd=false", () => {
            expect(
                shouldSyncAcceptLopd(
                    { ...baseMember, acceptLopd: false } as any,
                    { hasConsent: false } as any,
                    testCif
                )
            ).toBe(false)
        })

        it("should return false when consent hasConsent is null", () => {
            expect(
                shouldSyncAcceptLopd(
                    { ...baseMember, acceptLopd: false } as any,
                    { hasConsent: null } as any,
                    testCif
                )
            ).toBe(false)
        })
    })

    describe("needsAnyConsent", () => {
        it("should return true when either consent is pending", () => {
            expect(needsAnyConsent(baseMember as any, null, testCif)).toBe(true)
        })

        it("should return false when all consents are accepted", () => {
            expect(
                needsAnyConsent(
                    { acceptedTermsAndCondition: true, acceptLopd: true } as any,
                    { hasConsent: true } as any,
                    testCif
                )
            ).toBe(false)
        })

        it("should return true when terms only are pending", () => {
            expect(
                needsAnyConsent(
                    { acceptedTermsAndCondition: false, acceptLopd: true } as any,
                    { hasConsent: true } as any,
                    testCif
                )
            ).toBe(true)
        })

        it("should return true when lopd consent only is pending", () => {
            expect(
                needsAnyConsent(
                    { acceptedTermsAndCondition: true, acceptLopd: true } as any,
                    { hasConsent: false } as any,
                    testCif
                )
            ).toBe(true)
        })
    })
})
