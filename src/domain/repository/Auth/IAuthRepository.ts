import {ActiveAccountArgs, Authentication} from "@/domain/entity/Auth/auth";
import {Token} from "@/domain/entity/Token/token";
import {MfaRequest, Otp} from "@/domain/entity/Otp/otp";

export default interface IAuthRepository {
    verifyMemberIdentification(identificationNumber: string, recaptchaAction: string, recaptchaToken: string): Promise<Authentication>
    verifyActivationOtp(identificationNumber: string, otpCode: string, otpToken: string): Promise<string>
    activeAccount(args: ActiveAccountArgs): Promise<{ token: Token; cookie: string }>
    refreshToken(recaptchaToken: string, recaptchaAction: string): Promise<{ token: Token; cookie: string }>
    getLoginOtp(identificationNumber: string, password: string, recaptchaAction: string, recaptchaToken: string): Promise<Otp>
    verifyLoginOtp(identificationNumber: string, otpCode: string, otpToken: string): Promise<{ token: Token; cookie: string }>
    getResetPasswordOtp(identificationNumber: string, recaptchaAction: string, recaptchaToken: string): Promise<Otp>
    verifyResetPasswordOtp(identificationNumber: string, otpCode: string, otpToken: string): Promise<string>
    resetPassword(identification: string, mfaRequest: MfaRequest, resetPasswordToken: string, password: string): Promise<{ token: Token; cookie: string }>
    isValidCookie(recaptchaToken: string, recaptchaAction: string): Promise<boolean>
    revokeToken(token: Token): Promise<void>
}