import {Consent} from "@/domain/entity/Member/consent";

type ConsentApiPayload = Pick<Consent, "hasConsent" | "acceptedTermsConditions" | "url">

export const consentAdapter = (data: ConsentApiPayload): Consent =>{
    return {
        hasConsent: data.hasConsent,
        acceptedTermsConditions: data.acceptedTermsConditions,
        url: data.url
    }
}

export const getCifAdapter = (data: Record<string, unknown>): string | null => {
    return typeof data.clientIdentifierField === 'string' ? data.clientIdentifierField : null;
}
