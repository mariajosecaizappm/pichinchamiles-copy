import {Otp} from "@/domain/entity/Otp/otp";

export enum AuthFlow {
    LOGIN = 'LOGIN',
    ACTIVATE_ACCOUNT = 'ACTIVATE_ACCOUNT',
    RESET_PASSWORD = 'RESET_PASSWORD',
    UPDATE_PERSONAL_INFORMATION ="UPDATE_PERSONAL_INFORMATION"
}

type LoginFlow = {
    flow: AuthFlow.LOGIN
}

type ActivationFlow = {
    flow: AuthFlow.ACTIVATE_ACCOUNT
    otp: Otp
}

type ResetPasswordFlow = {
    flow: AuthFlow.RESET_PASSWORD
    otp: Otp
}

type UpdateMemberFlow = {
    flow: AuthFlow.UPDATE_PERSONAL_INFORMATION
}

export type Authentication = LoginFlow | ActivationFlow | ResetPasswordFlow | UpdateMemberFlow

export type ActiveAccountArgs = {
    acceptedLopd: boolean
    acceptedTermsAndCondition: boolean
    activeAccountToken: string
    identificationNumber: string
    password: string
    mfaToken: string
    mfaCode: string
}