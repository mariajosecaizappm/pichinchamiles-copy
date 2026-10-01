import {createContext} from "react";
import {Authentication} from "@/domain/entity/Auth/auth";
import {MfaRequest, Otp} from "@/domain/entity/Otp/otp";

export type AuthModalContextValues = {
    auth: Authentication | null,
    identification: string
    setAuth: (auth: Authentication, identification?: string) => void
    clearAuth: () => void
    mfaRequest: MfaRequest | null
    setMfaRequest: (mfaRequest: MfaRequest) => void
    onLoadAuthMember: () => Promise<void>
    otp: Otp | null
    setOtp: (otp: Otp | null) => void
    blockedUntil: Date | null
    onBlock: (blockedUntil: Date) => void
    onUnblock: () => void
    onContinueBlock: () => void
    currentStep: number
    backStep: () => void
}

const authModalContext = createContext<AuthModalContextValues>({
    auth: null,
    identification: "",
    setAuth: () => {},
    clearAuth: () => {},
    mfaRequest: null,
    setMfaRequest: () => {},
    onLoadAuthMember: async () => {},
    otp: null,
    setOtp: () => {},
    blockedUntil: null,
    onBlock: () =>{},
    onUnblock: () => {},
    onContinueBlock: () => {},
    currentStep: 1,
    backStep: () => {},
});

export default authModalContext;