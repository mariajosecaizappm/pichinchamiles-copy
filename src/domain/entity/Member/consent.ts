export type Consent = {
    url: string
    hasConsent: boolean | null
    acceptedTermsConditions: boolean
}

export type ConsentRegister = {
    cif: string
    action: string
    hasConsent: boolean
} & Pick<Consent, 'acceptedTermsConditions' | 'url'>