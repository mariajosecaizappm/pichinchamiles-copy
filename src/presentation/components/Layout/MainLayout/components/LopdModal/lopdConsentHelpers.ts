import { Member } from "@/domain/entity/Member/member"
import { Consent } from "@/domain/entity/Member/consent"

export type LopdConsentFormValues = {
    acceptedTermsAndCondition: boolean
    acceptedLopd: boolean
}

export const defaultLopdConsentFormValues: LopdConsentFormValues = {
    acceptedTermsAndCondition: false,
    acceptedLopd: false,
}

export const needsTermsConsent = (member: Member | null): boolean =>
    Boolean(member && !member.acceptedTermsAndCondition)

export const needsLopdConsent = (
    member: Member | null,
    consent: Consent | null,
    cif: string
): boolean => {
    if (!member) return false

    if (!cif || !consent) {
        return !member.acceptLopd
    }

    return consent?.hasConsent === false
}

export const shouldSyncAcceptLopd = (
    member: Member | null,
    consent: Consent | null,
    cif: string
): boolean => {
    if (!member || !cif || !consent) return false
    return consent?.hasConsent === true && !member.acceptLopd
}

export const needsAnyConsent = (
    member: Member | null,
    consent: Consent | null,
    cif: string
): boolean =>
    needsTermsConsent(member) || needsLopdConsent(member, consent, cif)

export const LOPD_ONLY_CONSENT_MODAL_MESSAGE =
    "Al autorizar el Tratamiento de tus datos personales, podrás recibir ofertas personalizadas y beneficios exclusivos."

export const TERMS_AND_LOPD_CONSENT_MODAL_MESSAGE =
    "Al aceptar los Términos y Condiciones y autorizar el Tratamiento de tus datos personales, podrás recibir ofertas personalizadas y beneficios exclusivos."

export const TERMS_ONLY_CONSENT_MODAL_MESSAGE =
    "Acepta los Términos y Condiciones del programa para continuar."

export const getLopdConsentModalMessage = (options: {
    withTerms: boolean
    withLopd: boolean
}): string => {
    if (options.withTerms && options.withLopd) {
        return TERMS_AND_LOPD_CONSENT_MODAL_MESSAGE
    }
    if (options.withLopd) {
        return LOPD_ONLY_CONSENT_MODAL_MESSAGE
    }
    if (options.withTerms) {
        return TERMS_ONLY_CONSENT_MODAL_MESSAGE
    }
    return TERMS_ONLY_CONSENT_MODAL_MESSAGE
}
