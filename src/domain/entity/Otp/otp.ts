export interface Otp{
    cellPhone: string | null
    durationOtpCodeMinutes: number
    email: string | null
    mfaToken: string
    expirationDate?: Date
}

export type MfaRequest = {
    mfaToken: string
    mfaCode: string
}