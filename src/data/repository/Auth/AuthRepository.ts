import {injectable} from "inversify";
import "reflect-metadata"
import IAuthRepository from "@/domain/repository/Auth/IAuthRepository";
import RepositoryBase from "@/data/repository/RepositoryBase";
import {ActiveAccountArgs, Authentication} from "@/domain/entity/Auth/auth";
import ax from "@/data/provider/axios/axiosClient";
import {ApiError} from "@/domain/entity/Error/models/ApiError";
import {ErrorCode} from "@/domain/entity/Error/structure/error";
import {getTokenAdapter, validateIdentificationAdapter, otpAdapter} from "@/data/adapters/Auth/authAdapters";
import {Token} from "@/domain/entity/Token/token";
import {MfaRequest, Otp} from "@/domain/entity/Otp/otp";
import {sha512} from "js-sha512";
import axPrivate from "@/data/provider/axios/axiosPrivate";

@injectable()
export default class AuthRepository extends RepositoryBase implements IAuthRepository {
    async verifyMemberIdentification(identificationNumber: string, recaptchaAction: string, recaptchaToken: string): Promise<Authentication> {
        const payload = {
            identification: identificationNumber
        }

        const { data } = await ax.post(`${this.identityPrefix}/${this.programId}/users/members/onboardings/identifications`, payload, {
            headers: {
                "Recaptchaaction": recaptchaAction,
                "Recaptchatoken": recaptchaToken
            }
        })

        if(data.nextStep === 'ERROR'){
            throw new ApiError(ErrorCode.USER_CANCELED)
        }

        return validateIdentificationAdapter(data)
    }

    async verifyActivationOtp(identificationNumber: string, otpCode: string, otpToken: string): Promise<string> {
        const payload = {
            identification: identificationNumber,
            mfaCode: otpCode,
            mfaToken: otpToken
        }

        const { data } = await ax.post(`${this.identityPrefix}/${this.programId}/users/members/v2/activate-accounts/validate-otp`, payload);
        return data.activateAccountToken
    }

    async activeAccount(args: ActiveAccountArgs): Promise<{ token: Token; cookie: string }>{
        const payload = {
            acceptedLopd: args.acceptedLopd,
            acceptedTermsAndCondition: args.acceptedTermsAndCondition,
            activeAccountToken: args.activeAccountToken,
            client_id: this.clientId,
            identification: args.identificationNumber,
            password: args.password,
            site: 'web',
            mfaToken: args.mfaToken,
            mfaCode: args.mfaCode
        }

        const { data, headers } = await ax.post(`${this.identityPrefix}/${this.programId}/users/members/v2/activate-accounts`, payload)
        const cookie = headers['xdcartokens'];
        return {
            token: getTokenAdapter(data),
            cookie
        };
    }

    async refreshToken(recaptchaToken: string, recaptchaAction: string): Promise<{ token: Token; cookie: string }>{
        const payload = {
            client_id: this.clientId,
            grant_type: "refresh_token"
        }
        const { data, headers } = await ax.post(`${this.identityPrefix}/oauth/token`, payload, {
            headers: {
                "Recaptchaaction": recaptchaAction,
                "Recaptchatoken": recaptchaToken
            }
        });

        const cookie = headers['xdcartokens'];
        return {
            token: getTokenAdapter(data),
            cookie
        };
    }

    async getLoginOtp(identificationNumber: string, password: string, recaptchaAction: string, recaptchaToken: string): Promise<Otp>{
        const payload = {
            client_id: this.clientId,
            grant_type: "password",
            username: identificationNumber,
            password
        }

        const { data } = await ax.post(`${this.identityPrefix}/oauth/token`, payload, {
            headers: {
                "Recaptchaaction": recaptchaAction,
                "Recaptchatoken": recaptchaToken
            }
        });

        return otpAdapter(data)
    }

    async verifyLoginOtp(identificationNumber: string, otpCode: string, otpToken: string): Promise<{ token: Token; cookie: string }>{
        const payload = {
            client_id: this.clientId,
            identification: identificationNumber,
            mfaCode: otpCode,
            mfaToken: otpToken
        }

        const { data, headers } = await ax.post(`${this.identityPrefix}/${this.programId}/users/members/auth/login/v2/validate-otp`, payload);
        const cookie = headers['xdcartokens']

        return {
            token: getTokenAdapter(data),
            cookie
        };
    }

    async getResetPasswordOtp(identificationNumber: string, recaptchaAction: string, recaptchaToken: string): Promise<Otp>{
        const payload = {
            identification: identificationNumber
        }
        const { data } = await ax.post(`${this.identityPrefix}/${this.programId}/users/members/auth/forgot-password`, payload, {
            headers: {
                "Recaptchaaction": recaptchaAction,
                "Recaptchatoken": recaptchaToken
            }
        });
        return otpAdapter(data);
    }

    async verifyResetPasswordOtp(identificationNumber: string, otpCode: string, otpToken: string): Promise<string>{
        const payload = {
            identification: identificationNumber,
            mfaCode: otpCode,
            mfaToken: otpToken
        }
        const { data } = await ax.post(`${this.identityPrefix}/${this.programId}/users/members/auth/v2/forgot-password/validate-otp`, payload);
        const hashValue = sha512(`${identificationNumber}-${otpCode}-${data.mfaToken}`);
        if(data.token !== hashValue) {
            throw new ApiError(ErrorCode.UNKNOWN);
        }

        return data.mfaToken
    }

    async resetPassword(identification: string, mfaRequest: MfaRequest, resetPasswordToken: string, password: string): Promise<{ token: Token; cookie: string }>{
        const payload = {
            password: password,
            identification,
            mfaCode: mfaRequest.mfaCode,
            mfaToken: mfaRequest.mfaToken,
            client_id: this.clientId,
            forgotPasswordToken: resetPasswordToken,
        }

        const { data, headers } = await ax.post(`${this.identityPrefix}/${this.programId}/users/members/auth/v2/reset-password`, payload);
        const cookie = headers['xdcartokens'];

        return {
            token: getTokenAdapter(data),
            cookie
        };
    }

    async isValidCookie(recaptchaToken: string, recaptchaAction: string): Promise<boolean>{
        const { data } = await ax.get(`${this.identityPrefix}/${this.programId}/users/members/auth/cookie`, {
            headers: {
                "Recaptchaaction": recaptchaAction,
                "Recaptchatoken": recaptchaToken
            }
        })
        return data
    }

    revokeToken(token: Token): Promise<void>{
        const payload = {
            client_id: this.clientId,
            refresh_token: token.refreshToken
        }

        return axPrivate.post(`${this.identityPrefix}/oauth/revoke`, payload);
    }
}